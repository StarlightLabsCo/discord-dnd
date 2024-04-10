import type { Server } from "bun";
import { handleGenerateRequest } from "./generate";

export async function handleCharacterRequest(req: Request, server: Server) {
    const url = new URL(req.url);

    if (url.pathname === "/api/character/generate")
        return handleGenerateRequest(req);
}
