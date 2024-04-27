import { create } from "zustand";
import { useDiscordStore } from "@/lib/discord";
import {
    validateWebSocketRequest,
    validateWebSocketResponse,
} from "starlight-api-types/websocket";

import { handleUserInfoResponse } from "./handlers/userInfo";
import { handleInstanceStateResponse } from "./handlers/instanceState";
import { handleGameStartResponse } from "./handlers/gameStart";
import { handleMessageAddedResponse } from "./handlers/messageAdded";
import { handleErrorResponse } from "./handlers/error";

type WebSocketStore = {
    ws: WebSocket | null;
    connect: () => void;
    exponentialBackoff: number;
};

type WebSocketStoreSet = (arg0: {
    ws?: WebSocket | null;
    connect?: () => void;
    exponentialBackoff?: number;
}) => void;

export const useWebsocketStore = create<WebSocketStore>((set, get) => ({
    ws: null,
    connect: () => connect(set, get),
    exponentialBackoff: 250,
}));

async function connect(set: WebSocketStoreSet, get: () => WebSocketStore) {
    try {
        console.log(`[DiscordD&D WS] Connecting...`);

        const access_token = useDiscordStore.getState().auth?.access_token;
        const instanceId = useDiscordStore.getState().instanceId;

        if (!access_token) {
            console.error("[DiscordD&D WS] No access_token found");
            return;
        }

        if (!instanceId) {
            console.error("[DiscordD&D WS] No instanceId found");
            return;
        }

        const ws = new WebSocket(
            `wss://${location.host}/api/ws?access_token=${access_token}&instanceId=${instanceId}`
        );

        ws.onopen = () => {
            console.log(`[DiscordD&D WS] Connected`);
            set({ ws, exponentialBackoff: 1000 });
        };

        ws.onmessage = onMessage;

        ws.onerror = (error) => {
            console.error("[DiscordD&D WS] Error:", error);
        };

        ws.onclose = (event: CloseEvent) => {
            console.log(
                `[DiscordD&D WS] WebSocket connection closed. Code: ${event.code} Reason: ${event.reason}`
            );

            set({
                ws: null,
            });

            if (!event.wasClean) {
                // TODO: log error to sentry
            }

            retry(set, get);
        };
    } catch (error) {
        console.error("[DiscordD&D WS] Error:", error);
        retry(set, get);
    }
}

async function retry(set: WebSocketStoreSet, get: () => WebSocketStore) {
    setTimeout(() => {
        set({ exponentialBackoff: get().exponentialBackoff * 2 });
        get().connect();
    }, get().exponentialBackoff);
}

export function sendMessage(message: string) {
    console.log(`[DiscordD&D WS] Sending message: ${message}`);

    const ws = useWebsocketStore.getState().ws;
    if (!ws) {
        console.error("[DiscordD&D WS] WebSocket connection not open");
        return;
    }

    const request = validateWebSocketRequest(message);
    if (!request) {
        console.error("[DiscordD&D WS] Invalid request:", message);
        return;
    }

    ws.send(JSON.stringify(request));
}

async function onMessage(event: MessageEvent) {
    console.log(`[DiscordD&D WS] Message: ${event.data}`);

    try {
        const response = validateWebSocketResponse(event.data);
        if (!response) return;

        const handler = handlers[response.type as keyof typeof handlers];
        if (!handler) {
            console.error(
                "[DiscordD&D WS] No handler for message type:",
                response.type
            );
            return;
        }

        await handler(response as any);
    } catch (error) {
        console.error("[DiscordD&D WS] Error parsing message:", error);
    }
}

const handlers = {
    UserInfoResponse: handleUserInfoResponse,
    InstanceStateResponse: handleInstanceStateResponse,
    GameStartResponse: handleGameStartResponse,
    MessageAddedResponse: handleMessageAddedResponse,
    ErrorResponse: handleErrorResponse,
};
