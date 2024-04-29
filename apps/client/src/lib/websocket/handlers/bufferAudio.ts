import { useAudioStore } from "@/lib/game/audio";
import { bufferBase64Audio } from "@/lib/game/audio/playback";
import { BufferAudioResponse } from "starlight-api-types/websocket";

export async function bufferAudio(response: BufferAudioResponse) {
    const audioContext = useAudioStore.getState().audioContext;
    const bufferedPlayerNode = useAudioStore.getState().bufferedPlayerNode;

    bufferBase64Audio(audioContext, bufferedPlayerNode, response.data.buffer);
}
