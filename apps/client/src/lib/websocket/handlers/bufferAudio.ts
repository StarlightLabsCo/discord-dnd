import { useAudioStore } from "@/lib/game/audio";
import { bufferBase64Audio } from "@/lib/game/audio/playback";
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

    console.log(`Buffering audio... (${response.data.buffer.length} bytes)`);
    bufferBase64Audio(audioContext, bufferedPlayerNode, response.data.buffer);
}
