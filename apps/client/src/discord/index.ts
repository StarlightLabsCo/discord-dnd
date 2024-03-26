import { DiscordSDK } from "@discord/embedded-app-sdk";
import { create } from "zustand";
import { authenticate, Auth } from "./auth";

// ---- Store ----
type DiscordStore = {
    instanceId: string | null;
    setInstanceId: (instanceId: string | null) => void;
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void;
};

const useDiscordStore = create<DiscordStore>((set) => ({
    instanceId: null,
    setInstanceId: (instanceId: string | null) => set({ instanceId }),
    auth: null,
    setAuth: (auth: Auth | null) => set({ auth }),
}));

// ---- Setup Discord SDK ----
const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

const instanceId = discordSdk.instanceId;
useDiscordStore.getState().setInstanceId(instanceId);

async function setup() {
    await discordSdk.ready();
    const auth = await authenticate();
    useDiscordStore.getState().setAuth(auth);
}

export { setup, discordSdk as default, useDiscordStore };
