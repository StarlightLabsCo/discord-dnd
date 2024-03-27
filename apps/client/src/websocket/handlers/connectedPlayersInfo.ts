import { ConnectedPlayersInfoResponse } from "starlight-api-types/websocket";

export async function handleConnectedPlayersInfoResponse(
    response: ConnectedPlayersInfoResponse
) {
    alert("ConnectedPlayersInfoResponse");
    console.log(response);
}
