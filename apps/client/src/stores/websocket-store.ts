import { create } from "zustand";

type WebsocketStore = {
    ws: WebSocket | null;

    connect: () => void;
};

export const useWebsocketStore = create<WebsocketStore>((set, get) => ({
    ws: null,

    connect: () => {
        try {
            console.log("[WS] Connecting");
            const ws = new WebSocket("/api/ws");

            ws.onopen = () => {
                console.log("[WS] Connected");
                set({ ws });
            };

            ws.onmessage = (event) => {
                console.log(`[WS] Message: ${event.data}`);
            };

            ws.onclose = () => {
                console.log("[WS] Disconnected");
                set({ ws: null });
            };
        } catch (error) {
            console.error("[WS] Error:", error);
        }
    },
}));
