import { create } from "zustand";
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

export const useMusicStore = create<MusicStore>((set, get) => {
    const createAudio = (index: number) => {
        const audio = new Audio(musicFiles[index].src);
        audio.volume = get().volume;
        audio.onended = () => get().next();
        return audio;
    };

    const updateMusicIndex = (index: number) => {
        get().pause();
        set({ musicIndex: index, audio: createAudio(index) });
        get().play();
    };

    return {
        audio: createAudio(Math.floor(Math.random() * musicFiles.length)),
        musicIndex: 0,
        playing: false,
        volume: 0.5,

        play: () => {
            const { audio } = get();
            if (!audio.src) {
                audio.src = musicFiles[get().musicIndex].src;
            }
            set({ playing: true });
            audio.play();
        },
        pause: () => {
            set({ playing: false });
            get().audio.pause();
        },
        next: () => {
            const nextIndex = (get().musicIndex + 1) % musicFiles.length;
            updateMusicIndex(nextIndex);
        },
        prev: () => {
            const prevIndex =
                (get().musicIndex - 1 + musicFiles.length) % musicFiles.length;
            updateMusicIndex(prevIndex);
        },
        setVolume: (volume: number) => {
            set((state) => {
                state.audio.volume = volume;
                return { volume };
            });
        },
    };
});
