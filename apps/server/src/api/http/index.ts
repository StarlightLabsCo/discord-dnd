import type { Server } from "bun";
import { handleTokenRequest } from "./handlers/token.js";
import { handleWebSocketInitRequest } from "./handlers/websocket.js";
import { handleCharacterRequest } from "./handlers/character/index.js";

export async function handleApiRequest(req: Request, server: Server) {
    const url = new URL(req.url);

    if (url.pathname === "/api/token") return handleTokenRequest(req);
    if (url.pathname === "/api/ws")
        return handleWebSocketInitRequest(req, server);
    if (url.pathname.startsWith("/api/character"))
        return handleCharacterRequest(req, server);
}
