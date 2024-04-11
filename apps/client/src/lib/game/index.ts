import { create } from "zustand";
import { Character, User } from "database";
import discordSdk from "@/lib/discord";

type LobbyPlayer = {
    user: User;
    character: Character | null;
    ready: boolean;
};

type GameStore = {
    user: User | null;
    setUser: (user: User) => void;

    connectedPlayers: LobbyPlayer[];
    setConnectedPlayers: (players: LobbyPlayer[]) => void;
};

export const useGameStore = create<GameStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),

    connectedPlayers: [],
    setConnectedPlayers: (players: LobbyPlayer[]) => {
        set({ connectedPlayers: players });

        discordSdk.commands.setActivity({
            activity: {
                details: "Lobby",
                state: "New Campaign. Party:",
                party: {
                    id: discordSdk.instanceId,
                    size: [Math.min(players.length, 6), 6],
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
    useGameStore.getState().setUser({
        id: "1234",
        username: "TestUser",
        discriminator: "0000",
        avatar: "avatar",
        global_name: "TestUser",
        avatar_decoration: "avatar_decoration",
        locale: "en-US",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    useGameStore.getState().setConnectedPlayers([
        {
            user: {
                id: "1234",
                username: "TestUser",
                discriminator: "0000",
                avatar: "avatar",
                global_name: "TestUser",
                avatar_decoration: "avatar_decoration",
                locale: "en-US",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            character: null,
            ready: false,
        },
        {
            user: {
                id: "5678",
                username: "TestUser2",
                discriminator: "0001",
                avatar: "avatar2",
                global_name: "TestUser2",
                avatar_decoration: "avatar_decoration2",
                locale: "en-US",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            character: null,
            ready: false,
        },
    ]);
}
