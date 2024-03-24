import { create } from "zustand";

type WebsocketStore = {
    ws: WebSocket | null;

    connect: () => void;
};

export const useWebsocketStore = create<WebsocketStore>((set, get) => ({
    ws: null,

    connect: () => {
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
    },
}));
