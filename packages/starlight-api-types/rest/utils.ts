export function validateRESTRequest(message: string | Buffer) {
    const rawRequest = JSON.parse(message.toString());

    return rawRequest;
}

export function validateRESTResponse(message: string | Buffer) {
    const rawResponse = JSON.parse(message.toString());

    return rawResponse;
}
