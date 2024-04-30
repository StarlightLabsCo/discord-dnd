import { useGameStore } from "@/lib/game";
import {
    InstanceStatePatchResponse,
    InstanceStateSchema,
} from "starlight-api-types/websocket";
import { Operation, applyPatch } from "fast-json-patch";

export async function handleInstanceStatePatchResponse(
    response: InstanceStatePatchResponse
) {
    const logObject = (label: string, object: any) => {
        const stringified = JSON.stringify(object, null, 2);
        const maxChunkSize = 1000;
        for (
            let offset = 0;
            offset < stringified.length;
            offset += maxChunkSize
        ) {
            const chunk = stringified.slice(offset, offset + maxChunkSize);
            console.log(`${label} (cont. ${offset / maxChunkSize})`, chunk);
        }
    };
    logObject("[InstanceStatePatch] response.data:", response.data);

    const { gameState, setGameState } = useGameStore.getState();
    const currentState = gameState || {};

    const newState = applyPatch(
        currentState,
        response.data as Operation[],
        true,
        false
    ).newDocument;

    logObject("[InstanceStatePatch] newState:", newState);

    console.log(
        `[InstanceStatePatch] gameState:`,
        gameState !== null ? "exists" : "null"
    );

    logObject(
        "[InstanceStatePatch] gameState?.streamedMessageWordTimings:",
        gameState?.streamedMessageWordTimings
    );

    const validatedInstanceState = InstanceStateSchema.safeParse(newState);

    logObject(
        "[InstanceStatePatch] validatedInstanceState:",
        validatedInstanceState
    );

    if (validatedInstanceState.success) {
        setGameState(validatedInstanceState.data);
    } else {
        logObject("[InstanceStatePatch] Error:", validatedInstanceState.error);
    }
}
