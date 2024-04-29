import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setupBufferedPlayerProcessor } from "./playback";

type AudioStore = {
    masterVolume: number;
    dialogueVolume: number;
    musicVolume: number;
    soundEffectsVolume: number;

    setMasterVolume: (volume: number) => void;
    setDialogueVolume: (volume: number) => void;
    setMusicVolume: (volume: number) => void;
    setSoundEffectsVolume: (volume: number) => void;

    audioContext: AudioContext;
    bufferedPlayerNode: AudioWorkletNode | null;
    setup: () => void;
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

            audioContext: new AudioContext({
                sampleRate: 44100,
                latencyHint: "interactive",
            }),
            bufferedPlayerNode: null,
            setup: async () => {
                const audioContext = get().audioContext;

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
        }),
        {
            name: "audio-settings",
            getStorage: () => localStorage,
        }
    )
);
