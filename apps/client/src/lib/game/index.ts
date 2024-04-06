import { create } from "zustand";
import { User } from "database";
import discordSdk from "@/lib/discord";

type GameState = {
    readyUserIds: string[];
};

type GameStore = {
    user: User | null;
    setUser: (user: User) => void;

    connectedPlayers: User[];
    setConnectedPlayers: (players: User[]) => void;

    gameState: GameState;
    setGameState: (gameState: GameState) => void;

    // TODO: MOVE THIS SOMEWHERE ELSE
    character: Character;
    setCharacter: (character: Character) => void;
};

// TODO: MOVE THIS SOMEWHERE ELSE
type Character = {
    origin: number;
    race: number;
    class: number;
};

export const useGameStore = create<GameStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),

    connectedPlayers: [],
    setConnectedPlayers: (players: User[]) => {
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

    gameState: {
        readyUserIds: [],
    },
    setGameState: (gameState: GameState) => set({ gameState }),

    // TODO: MOVE THIS SOMEWHERE ELSE
    character: {
        origin: 0,
        race: 0,
        class: 0,
    },
    setCharacter: (character: Character) => set({ character }),
}));

// TODO: remove debug flag
if (import.meta.env.VITE_DISCORD_EMBED_DEBUG) {
    useGameStore.getState().setUser({
        id: "1234",
        username: "TestUser",
        discriminator: "0000",
        avatar: "avatar",
        global_name: "TestUser",
        avatar_decoration: "avatar_decoration",
        locale: "en-US",
        updatedAt: new Date(),
    });

    useGameStore.getState().setConnectedPlayers([
        {
            id: "1234",
            username: "TestUser",
            discriminator: "0000",
            avatar: "avatar",
            global_name: "TestUser",
            avatar_decoration: "avatar_decoration",
            locale: "en-US",
            updatedAt: new Date(),
        },
        {
            id: "5678",
            username: "TestUser2",
            discriminator: "0001",
            avatar: "avatar2",
            global_name: "TestUser2",
            avatar_decoration: "avatar_decoration2",
            locale: "en-US",
            updatedAt: new Date(),
        },
        {
            id: "91011",
            username: "TestUser3",
            discriminator: "0002",
            avatar: "avatar3",
            global_name: "TestUser3",
            avatar_decoration: "avatar_decoration3",
            locale: "en-US",
            updatedAt: new Date(),
        },
        {
            id: "121314",
            username: "TestUser4",
            discriminator: "0003",
            avatar: "avatar4",
            global_name: "TestUser4",
            avatar_decoration: "avatar_decoration4",
            locale: "en-US",
            updatedAt: new Date(),
        },
    ]);
}
