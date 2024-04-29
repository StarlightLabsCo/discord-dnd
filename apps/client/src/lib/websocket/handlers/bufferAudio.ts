import { useAudioStore } from "@/lib/game/audio";
import {
    bufferBase64Audio,
    clearBufferedPlayerNodeBuffer,
} from "@/lib/game/audio/playback";
import { BufferAudioResponse } from "starlight-api-types/websocket";

export async function handleBufferAudioResponse(response: BufferAudioResponse) {
    const audioContext = useAudioStore.getState().audioContext;
    const bufferedPlayerNode = useAudioStore.getState().bufferedPlayerNode;

    if (audioContext === null) {
        console.log("audioContext is null");
        return;
    }

    if (bufferedPlayerNode === null) {
        console.log("bufferedPlayerNode is null");
        return;
    }

    if (response.data.start) {
        clearBufferedPlayerNodeBuffer(bufferedPlayerNode);
        useAudioStore.setState({ streamedMessageId: response.data.messageId });
        useAudioStore.setState({ audioStartTime: new Date() });
    }

    console.log(`Buffering audio for message ${response.data.messageId}`);
    console.log(`Buffer length: ${response.data.buffer.length}`);
    bufferBase64Audio(audioContext, bufferedPlayerNode, response.data.buffer);
}
