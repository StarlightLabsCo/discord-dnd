import { create } from "zustand";

import { User } from "database";
import { InstanceState } from "starlight-api-types/websocket";
import discordSdk from "@/lib/discord";

type GameStore = {
    user: User | null;
    setUser: (user: User) => void;

    gameState: InstanceState | null;
    setGameState: (state: InstanceState) => void;

    playerMenuDialogOpen: boolean;
    setPlayerMenuDialogOpen: (open: boolean) => void;
};

export const useGameStore = create<GameStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),

    gameState: null,
    setGameState: (gameState: InstanceState) => {
        set({ gameState });

        if (!gameState) return;
        discordSdk.commands.setActivity({
            activity: {
                details:
                    gameState.selectedCampaignInstance?.name || "New Campaign",
                state: gameState.state === "LOBBY" ? "Lobby" : "In Game",
                party: {
                    id: discordSdk.instanceId,
                    size: [Math.min(gameState.connectedPlayers.length, 6), 6],
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

    playerMenuDialogOpen: false,
    setPlayerMenuDialogOpen: (open: boolean) =>
        set({ playerMenuDialogOpen: open }),
}));
