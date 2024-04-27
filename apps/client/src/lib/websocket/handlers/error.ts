import { ErrorResponse } from "starlight-api-types/websocket";

export async function handleErrorResponse(response: ErrorResponse) {
    console.error(response.data.error);
}
