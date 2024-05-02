import type { Server } from "bun";
import { getUser } from "@/lib/discord";

export async function handleWebSocketInitRequest(req: Request, server: Server) {
    // DEBUG
    if (process.env.STARLIGHT_DEBUG) {
        console.log("DEBUG: Skipping Discord OAuth for WebSocket connection");
        server.upgrade(req, {
            data: {
                user: {
                    id: "1077378222834073682",
                    username: "starlightharris",
                    global_name: "starlight-harris",
                    discriminator: "0",
                    avatar: null,
                    locale: "en-US",
                    avatar_decoration: null,
                    createdAt: new Date("2024-04-11T02:40:40.464Z"),
                    updatedAt: new Date("2024-05-01T22:19:13.782Z"),
                },
                instanceId: "fake-instance-id",
            },
        });
        return undefined;
    }

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
