import { getResponseSchema } from ".";

export function validateWebSocketRequest(message: string | Buffer) {
    const rawRequest = JSON.parse(message.toString());

    return rawRequest;
}

export function validateWebSocketResponse(message: string | Buffer) {
    const rawResponse = JSON.parse(message.toString());

    const schema = getResponseSchema(rawResponse.type);
    if (!schema) {
        console.error("Received unknown response type", rawResponse.type);
        return;
    }

    const result = schema.safeParse(rawResponse);
    if (!result.success) {
        console.error("Malformed or invalid response data:", result.error);
        return;
    }

    return result.data as (typeof result)["data"];
}
