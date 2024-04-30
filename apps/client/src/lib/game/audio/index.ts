import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setupBufferedPlayerProcessor } from "./playback";
import { AudioWordTimings } from "starlight-api-types/websocket";

type AudioStore = {
    masterVolume: number;
    dialogueVolume: number;
    musicVolume: number;
    soundEffectsVolume: number;

    setMasterVolume: (volume: number) => void;
    setDialogueVolume: (volume: number) => void;
    setMusicVolume: (volume: number) => void;
    setSoundEffectsVolume: (volume: number) => void;

    audioContext: AudioContext | null;
    bufferedPlayerNode: AudioWorkletNode | null;
    setupAudioNodes: () => void;

    streamedMessageId: string | null;
    streamedMessageWordTimings: AudioWordTimings | null;
    audioStartTime: Date | null;
};

export const useAudioStore = create<AudioStore>()(
    persist(
        (set, get) => ({
            masterVolume: 0.75,
            dialogueVolume: 1,
            musicVolume: 1,
            soundEffectsVolume: 1,

            setMasterVolume: (volume: number) => set({ masterVolume: volume }),
            setDialogueVolume: (volume: number) =>
                set({ dialogueVolume: volume }),
            setMusicVolume: (volume: number) => set({ musicVolume: volume }),
            setSoundEffectsVolume: (volume: number) =>
                set({ soundEffectsVolume: volume }),

            audioContext: null,
            bufferedPlayerNode: null,
            setupAudioNodes: async () => {
                const audioContext = new AudioContext({
                    sampleRate: 44100,
                    latencyHint: "interactive",
                });

                set({ audioContext });

                // Create gain nodes for each audio type
                const masterGainNode = audioContext.createGain();
                masterGainNode.gain.value = get().masterVolume;
                masterGainNode.connect(audioContext.destination);

                const dialogueGainNode = audioContext.createGain();
                dialogueGainNode.gain.value = get().dialogueVolume;
                dialogueGainNode.connect(masterGainNode);

                const musicGainNode = audioContext.createGain();
                musicGainNode.gain.value = get().musicVolume;
                musicGainNode.connect(masterGainNode);

                const soundEffectsGain = audioContext.createGain();
                soundEffectsGain.gain.value = get().soundEffectsVolume;
                soundEffectsGain.connect(masterGainNode);

                // Setup the audio processor for streamed dialogue audio from 11 labs
                const blobURL = setupBufferedPlayerProcessor();
                await audioContext.audioWorklet.addModule(blobURL);

                const bufferedPlayerNode = new AudioWorkletNode(
                    audioContext,
                    "buffered-player-processor"
                );
                bufferedPlayerNode.connect(dialogueGainNode);

                set({ bufferedPlayerNode });
            },
            streamedMessageId: null,
            streamedMessageWordTimings: null,
            audioStartTime: null,
        }),
        {
            name: "audio-settings",
            getStorage: () => localStorage,
            partialize: (state) => ({
                masterVolume: state.masterVolume,
                dialogueVolume: state.dialogueVolume,
                musicVolume: state.musicVolume,
                soundEffectsVolume: state.soundEffectsVolume,
            }),
        }
    )
);
