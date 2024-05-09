import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { setupBufferedPlayerProcessor } from "./playback";

type AudioStore = {
    masterGainNode: AudioNode | null;
    dialogueGainNode: AudioNode | null;
    musicGainNode: AudioNode | null;
    soundEffectsGain: AudioNode | null;

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

    audioStartTime: Date | null;
};

export const useAudioStore = create<AudioStore>()(
    persist(
        (set, get) => ({
            masterGainNode: null,
            dialogueGainNode: null,
            musicGainNode: null,
            soundEffectsGain: null,

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
                set({ masterGainNode });

                const dialogueGainNode = audioContext.createGain();
                dialogueGainNode.gain.value = get().dialogueVolume;
                dialogueGainNode.connect(masterGainNode);
                set({ dialogueGainNode });

                const musicGainNode = audioContext.createGain();
                musicGainNode.gain.value = get().musicVolume;
                musicGainNode.connect(masterGainNode);
                set({ musicGainNode });

                const soundEffectsGain = audioContext.createGain();
                soundEffectsGain.gain.value = get().soundEffectsVolume;
                soundEffectsGain.connect(masterGainNode);
                set({ soundEffectsGain });

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
            audioStartTime: null,
        }),
        {
            name: "audio-settings",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                masterVolume: state.masterVolume,
                dialogueVolume: state.dialogueVolume,
                musicVolume: state.musicVolume,
                soundEffectsVolume: state.soundEffectsVolume,
            }),
        }
    )
);
