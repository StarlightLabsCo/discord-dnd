import { create } from "zustand";
import { useDiscordStore } from "./discord-store";

type WebSocketStore = {
    ws: WebSocket | null;
    connect: () => void;
    exponentialBackoff: number;

    debugMessages: string[];
};

type WebSocketStoreSet = (arg0: {
    ws?: WebSocket | null;
    connect?: () => void;
    exponentialBackoff?: number;

    debugMessages?: string[];
}) => void;

export const useWebsocketStore = create<WebSocketStore>((set, get) => ({
    ws: null,
    connect: () => connect(set, get),
    exponentialBackoff: 1000,

    debugMessages: [],
}));

async function connect(set: WebSocketStoreSet, get: () => WebSocketStore) {
    try {
        const instanceId = useDiscordStore.getState().instanceId;
        const ws = new WebSocket(
            `wss://${location.host}/api/ws?instanceId=${instanceId}`
        );

        ws.onopen = () => {
            set({ ws, exponentialBackoff: 1000 });
        };

        ws.onmessage = (event) => {
            console.log(`[DiscordD&D WS] Message: ${event.data}`);
            set({
                debugMessages: [...get().debugMessages, event.data],
            });
        };

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
