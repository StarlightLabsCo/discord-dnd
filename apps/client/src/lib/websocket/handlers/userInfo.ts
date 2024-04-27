import { useGameStore } from "@/lib/game";
import { UserInfoResponse } from "starlight-api-types/websocket";

export async function handleUserInfoResponse(response: UserInfoResponse) {
    console.log("DEBUG: handleUserInfoResponse");
    console.log(`DEBUG: response: ${JSON.stringify(response)}`);
    useGameStore.getState().setUser(response.data);
}
