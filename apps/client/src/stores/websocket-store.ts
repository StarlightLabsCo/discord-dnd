import { create } from "zustand";

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
        console.log("[WS] Connecting");

        const ws = new WebSocket(`wss://${location.host}/api/ws`);

        ws.onopen = () => {
            console.log("[WS] Connected");
            set({ ws, exponentialBackoff: 1000 });
        };

        ws.onmessage = (event) => {
            console.log(`[WS] Message: ${event.data}`);
        };

        ws.onerror = (error) => {
            console.error("[WS] Error:", error);
        };

        ws.onclose = (event: CloseEvent) => {
            set({
                ws: null,
            });

            console.log(
                `[WS] WebSocket connection closed. Code: ${event.code} Reason: ${event.reason}`
            );

            if (!event.wasClean) {
                // TODO: log error to sentry
            }

            retry(set, get);
        };
    } catch (error) {
        console.error("[WS] Error:", error);
        retry(set, get);
    }
}

async function retry(set: WebSocketStoreSet, get: () => WebSocketStore) {
    setTimeout(() => {
        set({ exponentialBackoff: get().exponentialBackoff * 2 });
        get().connect();
    }, get().exponentialBackoff);
}
