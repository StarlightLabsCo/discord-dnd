import type { Server } from "bun";
import { handleApiRequest } from "./src/api/http";
import { WebSocketHandlers } from "./src/api/websocket";

export const server = Bun.serve({
    async fetch(req: Request, server: Server) {
        try {
            const url = new URL(req.url);

            return url.pathname.startsWith("/api")
                ? await handleApiRequest(req, server)
                : new Response("Not Found", { status: 404 });
        } catch (e) {
            console.error(e);
            return new Response("Internal Server Error", { status: 500 });
        }
    },
    websocket: WebSocketHandlers,
});

console.log(
    `Backend server running at ${server.url ?? `0.0.0.0:${server.port}`}`
);
