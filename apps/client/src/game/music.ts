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

export const useMusicStore = create<MusicStore>((set, get) => ({
    audio: new Audio(
        musicFiles[Math.floor(Math.random() * musicFiles.length)].src
    ),
    musicIndex: 0,
    playing: false,
    volume: 1,

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
        set((state) => {
            let nextIndex = state.musicIndex + 1;
            if (nextIndex >= musicFiles.length) {
                nextIndex = 0;
            }
            get().pause();
            return {
                ...state,
                musicIndex: nextIndex,
                audio: new Audio(musicFiles[nextIndex].src),
            };
        });
        get().play();
    },
    prev: () => {
        set((state) => {
            let prevIndex = state.musicIndex - 1;
            if (prevIndex < 0) {
                prevIndex = musicFiles.length - 1;
            }
            get().pause();
            return {
                ...state,
                musicIndex: prevIndex,
                audio: new Audio(musicFiles[prevIndex].src),
            };
        });
        get().play();
    },
    setVolume: (volume) => {
        set({ volume });
        get().audio.volume = volume;
    },
}));

useMusicStore.getState().audio.addEventListener("ended", () => {
    useMusicStore.getState().next();
});
