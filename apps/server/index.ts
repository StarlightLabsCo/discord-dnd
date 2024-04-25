import type { Server } from "bun";
import { handleApiRequest } from "./src/api/http";
import { WebSocketHandlers } from "./src/api/websocket";

export const server = Bun.serve({
    async fetch(req: Request, server: Server) {
        try {
            const url = new URL(req.url);

            const response = url.pathname.startsWith("/api")
                ? await handleApiRequest(req, server)
                : new Response("Not Found", { status: 404 });

            if (process.env.NODE_ENV === "development" && response) {
                response.headers.set("Access-Control-Allow-Origin", "*");
                response.headers.set(
                    "Access-Control-Allow-Methods",
                    "GET, POST, OPTIONS, PUT, DELETE"
                );
                response.headers.set("Access-Control-Allow-Headers", "*");
            }

            return response;
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
