import { create } from "zustand";

type DiscordStore = {
    auth: any;
    setAuth: (auth: any) => void;
};

export const useDiscordStore = create<DiscordStore>((set) => ({
    auth: null,
    setAuth: (auth: any) => set({ auth }),
}));
