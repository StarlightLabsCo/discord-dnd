import { create } from "zustand";
import { useDiscordStore } from "./discord-store";

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
        const instanceId = useDiscordStore.getState().instanceId;
        const ws = new WebSocket(
            `wss://${location.host}/api/ws?instanceId=${instanceId}`
        );

        ws.onopen = () => {
            set({ ws, exponentialBackoff: 1000 });
        };

        ws.onmessage = (event) => {
            console.log(`[DiscordD&D WS] Message: ${event.data}`);

            try {
                const data = JSON.parse(event.data);
                if (
                    data.message.x !== undefined &&
                    data.message.y !== undefined
                ) {
                    drawOtherUserCursor(
                        data.message.x,
                        data.message.y,
                        data.userId
                    );
                }
            } catch (error) {
                console.error("[DiscordD&D WS] Error parsing message:", error);
            }
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

function drawOtherUserCursor(x: number, y: number, userId: string) {
    let cursor = document.getElementById(`cursor-${userId}`);
    if (!cursor) {
        cursor = document.createElement("div");
        cursor.id = `cursor-${userId}`;
        cursor.style.position = "absolute";
        cursor.style.width = "10px";
        cursor.style.height = "10px";
        cursor.style.backgroundColor = "red";
        document.body.appendChild(cursor);
    }
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
}
