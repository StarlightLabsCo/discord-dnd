import { handleWorldRequest } from "./world";

export async function handleDataRequest(req: Request) {
    if (req.url === "/api/data/world") {
        return handleWorldRequest(req);
    }
}
