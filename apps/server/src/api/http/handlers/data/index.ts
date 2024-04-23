import { handleWorldRequest } from "./world";

export async function handleDataRequest(req: Request) {
    const url = new URL(req.url);

    if (url.pathname === "/api/data/world") {
        return handleWorldRequest(req);
    }
}
