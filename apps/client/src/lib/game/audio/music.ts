import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { musicFiles } from "@/assets/music";

type MusicStore = {
    audio: HTMLAudioElement;
    musicIndex: number;
    playing: boolean;
    volume: number;

    play: () => void;
    pause: () => void;
    next: () => void;
    prev: () => void;
    setVolume: (volume: number) => void;
};

export const useMusicStore = create<MusicStore>()(
    persist(
        (set, get) => {
            const next = () => {
                const nextIndex = (get().musicIndex + 1) % musicFiles.length;
                updateMusicIndex(nextIndex);
            };

            const prev = () => {
                const prevIndex =
                    (get().musicIndex - 1 + musicFiles.length) %
                    musicFiles.length;
                updateMusicIndex(prevIndex);
            };

            const createAudio = (index: number) => {
                const audio = new Audio(musicFiles[index].src);
                audio.volume = get()?.volume !== undefined ? get().volume : 0.5;
                audio.onended = next;
                return audio;
            };

            const updateMusicIndex = (index: number) => {
                get().pause();
                set({ musicIndex: index, audio: createAudio(index) });
                get().play();
            };

            return {
                audio: createAudio(
                    Math.floor(Math.random() * musicFiles.length)
                ),
                musicIndex: 0,
                playing: false,
                volume: 0.5,

                play: () => {
                    if (get().volume === 0) return;
                    const { audio } = get();
                    if (!audio.src) {
                        audio.src = musicFiles[get().musicIndex].src;
                    }
                    set({ playing: true });
                    audio.play();
                },
                pause: () => {
                    if (get().volume === 0) return;
                    set({ playing: false });
                    get().audio.pause();
                },
                next,
                prev,
                setVolume: (volume: number) => {
                    set((state) => {
                        if (volume === 0) {
                            state.audio.pause();
                        }
                        state.audio.volume = volume;
                        return { volume };
                    });
                },
            };
        },
        {
            name: "music",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                volume: state.volume,
            }),
        }
    )
);
