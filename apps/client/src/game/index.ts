import { create } from "zustand";
import { User } from "database";

type GameStore = {
    connectedPlayers: User[];
    setConnectedPlayers: (players: User[]) => void;
};

export const useGameStore = create<GameStore>((set) => ({
    connectedPlayers: [],
    setConnectedPlayers: (players: User[]) =>
        set({ connectedPlayers: players }),
}));
