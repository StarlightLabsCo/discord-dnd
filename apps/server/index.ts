import type { Server } from "bun";
import { handleTokenRequest } from "./src/token";
import { handleWebSocket } from "./src/websocket";

const server = Bun.serve({
    async fetch(req: Request, server: Server) {
        try {
            const url = new URL(req.url);

            if (url.pathname === "/api/token") return handleTokenRequest(req);
            if (url.pathname === "/api/ws") return handleWebSocket(req, server);
            else return new Response("Not Found", { status: 404 });
        } catch (e) {
            console.error(e);
            return new Response("Internal Server Error", { status: 500 });
        }
    },
    websocket: {
        async open(ws) {
            console.log("[WS] Connected");
        },
        async message(ws, message) {
            console.log(`[WS] Message: ${message}`);
        },
        async close(ws) {
            console.log("[WS] Disconnected");
        },
    },
});

console.log(
    `Backend server running at ${server.url ?? `0.0.0.0:${server.port}`}`
);
