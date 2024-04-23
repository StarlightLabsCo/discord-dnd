import { useGameStore } from "@/lib/game";
import { InstanceStateResponse } from "starlight-api-types/websocket";

export async function handleInstanceStateResponse(
    response: InstanceStateResponse
) {
    useGameStore.getState().setState(response.data);
}
