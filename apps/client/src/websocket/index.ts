import { create } from "zustand";
import { useDiscordStore } from "../discord";
import { validateWebSocketResponse } from "starlight-api-types/websocket";
import { handleConnectedPlayersInfoResponse } from "./handlers/connectedPlayersInfo";

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
    exponentialBackoff: 1000,
}));

async function connect(set: WebSocketStoreSet, get: () => WebSocketStore) {
    try {
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
            set({ ws, exponentialBackoff: 1000 });
        };

        ws.onmessage = onMessage;

        ws.onerror = (error) => {
            console.error("[DiscordD&D WS] Error:", error);
        };

        ws.onclose = (event: CloseEvent) => {
            set({
                ws: null,
            });

            console.log(
                `[DiscordD&D WS] WebSocket connection closed. Code: ${event.code} Reason: ${event.reason}`
            );

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

async function onMessage(event: MessageEvent) {
    try {
        const response = validateWebSocketResponse(event.data);
        if (!response) return;

        const handler = handlers[response.type];
        if (!handler) {
            console.error(
                "[DiscordD&D WS] No handler for message type:",
                response.type
            );
            return;
        }

        await handler(response);
    } catch (error) {
        console.error("[DiscordD&D WS] Error parsing message:", error);
    }
}

const handlers = {
    ConnectedPlayersInfoResponse: handleConnectedPlayersInfoResponse,
};
