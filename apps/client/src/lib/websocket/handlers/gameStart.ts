import { router } from "@/main";
import { GameStartResponse } from "starlight-api-types/websocket";

export async function handleGameStartResponse(response: GameStartResponse) {
    router.navigate({
        to: "/game",
        replace: true,
    });
}
