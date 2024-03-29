import { create } from "zustand";
import { User } from "database";

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
};

export const useGameStore = create<GameStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),

    connectedPlayers: [],
    setConnectedPlayers: (players: User[]) =>
        set({ connectedPlayers: players }),

    gameState: {
        readyUserIds: [],
    },
    setGameState: (gameState: GameState) => set({ gameState }),
}));
