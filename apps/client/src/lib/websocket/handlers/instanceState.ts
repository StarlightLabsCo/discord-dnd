import { useGameStore } from "@/lib/game";
import { InstanceStateResponse } from "starlight-api-types/websocket";

export async function handleInstanceStateResponse(
    response: InstanceStateResponse
) {
    console.log("Received instance state response", response.data);
    useGameStore.getState().setState(response.data);
}
