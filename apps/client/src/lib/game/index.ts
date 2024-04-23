import { create } from "zustand";

import { User } from "database";
import { InstanceState } from "starlight-api-types/websocket";
import discordSdk from "@/lib/discord";

type GameStore = {
    user: User | null;
    setUser: (user: User) => void;

    state: InstanceState | null;
    setState: (state: InstanceState) => void;
};

export const useGameStore = create<GameStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),

    state: null,
    setState: (state: InstanceState) => {
        set({ state });

        if (!state) return;
        discordSdk.commands.setActivity({
            activity: {
                details: state.selectedCampaign?.name || "New Campaign",
                state: state.state === "LOBBY" ? "Lobby" : "In Game",
                party: {
                    id: discordSdk.instanceId,
                    size: [Math.min(state.connectedPlayers.length, 6), 6],
                },
                assets: {
                    large_image: "fantasyforgebigsquare",
                    large_text: "Fantasy Forge",
                    small_image: "fantasyforgebigsquare",
                    small_text: "Fantasy Forge",
                },
                instance: true,
            },
        });
    },
}));
