import { create } from "zustand";

import { User } from "database";
import { InstanceState } from "starlight-api-types/websocket";
import discordSdk from "@/lib/discord";
import { useCharacterEditorStore } from "./characterEditor";

type GameStore = {
    user: User | null;
    setUser: (user: User) => void;

    gameState: InstanceState | null;
    setGameState: (state: InstanceState) => void;
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
                details: gameState.selectedCampaign?.name || "New Campaign",
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
}));

if (import.meta.env.VITE_DISCORD_EMBED_DEBUG) {
    useGameStore.setState({
        user: {
            id: "1077378222834073682",
            username: "starlightharris",
            discriminator: "0",
            avatar: null,
            global_name: "starlight-harris",
            avatar_decoration: null,
            locale: "en-US",
            createdAt: new Date("2024-04-11T02:40:40.464Z"),
            updatedAt: new Date("2024-04-25T00:33:16.186Z"),
        },
        gameState: {
            state: "LOBBY",
            connectedPlayers: [
                {
                    user: {
                        id: "1077378222834073682",
                        username: "starlightharris",
                        discriminator: "0",
                        avatar: null,
                        global_name: "starlight-harris",
                        avatar_decoration: null,
                        locale: "en-US",
                        createdAt: new Date("2024-04-11T02:40:40.464Z"),
                        updatedAt: new Date("2024-04-25T00:33:16.186Z"),
                    },
                    character: null,
                    status: "NOT_READY",
                },
            ],
            selectedCampaign: {
                userId: "1077378222834073682",
                campaignId: "clv8n2t2y0001i5bqmip6nuu1",
                id: "clvcu9kz10000oxm3ux3c1crj",
                name: "Test Campaign",
                description: "Test Campaign Description",
                imageUrl:
                    "https://r2.starlightlabs.co/b1geoaf8w75h4rtetsc6b0kq.webp",
                createdAt: new Date(),
                updatedAt: new Date(),
                messages: [
                    {
                        id: "clv8n2t2y0001i5bqmip6nuu1",
                        instanceId: "1234",
                        characterInstanceId: null,
                        content:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        audioUrl: null,
                        audioWordTimings: null,
                        tag: null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        characterInstance: null,
                    },
                    {
                        id: "clv8n2t2y0001i5bqmip6nuu1",
                        instanceId: "1234",
                        characterInstanceId: null,
                        content:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        audioUrl: null,
                        audioWordTimings: null,
                        tag: null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        characterInstance: null,
                    },
                    {
                        id: "clv8n2t2y0001i5bqmip6nuu1",
                        instanceId: "1234",
                        characterInstanceId: null,
                        content:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        audioUrl: null,
                        audioWordTimings: null,
                        tag: null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        characterInstance: null,
                    },
                    {
                        id: "clv8n2t2y0001i5bqmip6nuu1",
                        instanceId: "1234",
                        characterInstanceId: null,
                        content:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        audioUrl: null,
                        audioWordTimings: null,
                        tag: null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        characterInstance: null,
                    },
                ],
                characterInstances: [],
            },
        },
    });

    useCharacterEditorStore
        .getState()
        .setWorldByCampaignId("clv8n2t2y0001i5bqmip6nuu1");
}
