import { Class } from "..";
import { items } from "@/game/items";

export const cleric: Class = {
    id: "cleric",
    title: "Cleric",
    startingItems: [
        items.blessedSymbol,
        items.vialOfHolyWater,
        items.prayerBeads,
    ],
};
