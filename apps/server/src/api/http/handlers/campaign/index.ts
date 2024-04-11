import type { Server } from "bun";

export async function handleCampaignRequest(req: Request, server: Server) {
    const url = new URL(req.url);

    if (url.pathname === "/api/campaign/") return new Response();
}
