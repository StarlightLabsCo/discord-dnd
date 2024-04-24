import { handleWorldRequest } from "./world";
import { handleCharacterRequest } from "./character";

export async function handleDataRequest(req: Request) {
    const url = new URL(req.url);

    if (url.pathname === "/api/data/world") {
        return handleWorldRequest(req);
    } else if (url.pathname === "/api/data/character") {
        return handleCharacterRequest(req);
    }
}
