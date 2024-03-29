import { useGameStore } from "@/game";
import { UserInfoResponse } from "starlight-api-types/websocket";

export async function handleUserInfoResponse(response: UserInfoResponse) {
    useGameStore.getState().setUser(response.data);
}
