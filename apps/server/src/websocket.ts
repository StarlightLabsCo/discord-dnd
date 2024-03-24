import type { Server } from "bun";

export async function handleWebSocket(req: Request, server: Server) {
    const success = server.upgrade(req);

    if (success) {
        return undefined; // Bun automatically returns a 101 switching protocols response
    } else {
        return new Response("Upgrade failed", { status: 400 });
    }
}
