import { create } from "zustand";
import { Auth } from "../discord/auth";

type DiscordStore = {
    instanceId: string | null;
    setInstanceId: (instanceId: string | null) => void;

    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
};

export const useDiscordStore = create<DiscordStore>((set) => ({
    instanceId: null,
    setInstanceId: (instanceId: string | null) => set({ instanceId }),

    auth: null,
    setAuth: (auth: Auth | null) => set({ auth }),
}));
