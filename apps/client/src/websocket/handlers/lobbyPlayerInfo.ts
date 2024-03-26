import { LobbyPlayerInfoResponse } from "starlight-api-types/websocket";

export async function handleLobbyPlayerInfoResponse(
    response: LobbyPlayerInfoResponse
) {
    alert("LobbyPlayerInfoResponse");
    console.log(response);
}
