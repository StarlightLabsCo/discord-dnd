import { Class } from "..";
import { items } from "@/game/items";

export const rogue: Class = {
    id: "rogue",
    title: "Rogue",
    startingItems: [
        items.lockpickSet,
        items.darkCommonClothes,
        items.goldPouch,
    ],
};
