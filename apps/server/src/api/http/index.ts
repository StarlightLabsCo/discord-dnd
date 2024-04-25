import type { Server } from "bun";
import { handleTokenRequest } from "./handlers/token.js";
import { handleWebSocketInitRequest } from "./handlers/websocket";
import { handleImageRequest } from "./handlers/image/index";
import { handleDataRequest } from "./handlers/data";

export async function handleApiRequest(req: Request, server: Server) {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    const url = new URL(req.url);

    if (url.pathname === "/api/token") return handleTokenRequest(req);
    if (url.pathname === "/api/ws")
        return handleWebSocketInitRequest(req, server);
    if (url.pathname.startsWith("/api/image")) return handleImageRequest(req);
    if (url.pathname.startsWith("/api/data")) return handleDataRequest(req);
}
