import { useAudioStore } from "@/lib/game/audio";
import { WordTimingsResponse } from "starlight-api-types/websocket";

export async function handleWordTimingsResponse(response: WordTimingsResponse) {
    const streamedMessageId = useAudioStore.getState().streamedMessageId;

    if (response.data.messageId == streamedMessageId) {
        console.log(`Received word timings for message ${streamedMessageId}`);
        console.log(response.data.wordTimings);

        useAudioStore.setState({
            streamedMessageWordTimings: response.data.wordTimings,
        });
    }
}
