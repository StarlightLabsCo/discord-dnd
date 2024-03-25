import type { Server } from "bun";
import { getUser } from "./discord";

export async function handleWebSocket(req: Request, server: Server) {
    // Get instanceId from query params
    const url = new URL(req.url);
    const access_token = url.searchParams.get("access_token");
    if (!access_token) {
        return new Response("access_token is required", { status: 400 });
    }

    const user = await getUser(access_token);
    if (!user) {
        return new Response("Invalid access_token", { status: 400 });
    }

    const instanceId = url.searchParams.get("instanceId");
    if (!instanceId) {
        return new Response("instanceId is required", { status: 400 });
    }

    // Upgrade the connection to a WebSocket (Bun auto sends 101 if successful)
    const success = server.upgrade(req, {
        data: {
            user,
            instanceId,
        },
    });

    if (success) {
        return undefined;
    } else {
        return new Response("Upgrade failed", { status: 400 });
    }
}
