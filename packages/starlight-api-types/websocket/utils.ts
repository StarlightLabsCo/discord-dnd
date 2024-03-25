export function validateWebSocketRequest(message: string | Buffer) {
    const rawRequest = JSON.parse(message.toString());

    return rawRequest;
}

export function validateWebSocketResponse(message: string | Buffer) {
    const rawResponse = JSON.parse(message.toString());

    return rawResponse;
}
