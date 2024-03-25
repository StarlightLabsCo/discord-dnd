import type { Server } from "bun";

export async function handleWebSocket(req: Request, server: Server) {
    // Get instanceId from query params
    const url = new URL(req.url);
    const instanceId = url.searchParams.get("instanceId");

    if (!instanceId) {
        return new Response("instanceId is required", { status: 400 });
    }

    // Upgrade the connection to a WebSocket (Bun auto sends 101 if successful)
    const success = server.upgrade(req, {
        data: {
            instanceId,
        },
    });

    if (success) {
        return undefined;
    } else {
        return new Response("Upgrade failed", { status: 400 });
    }
}
