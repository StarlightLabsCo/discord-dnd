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
        async message(ws, message) {
            console.log(`[WS] Message: ${message}`);
            ws.send("Hello World!");
        },
    },
});

console.log(`Backend server running at ${server.url}`);
