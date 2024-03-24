import { create } from "zustand";
import { Auth } from "../discord/auth";

type DiscordStore = {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
};

export const useDiscordStore = create<DiscordStore>((set) => ({
    auth: null,
    setAuth: (auth: Auth | null) => set({ auth }),
}));
