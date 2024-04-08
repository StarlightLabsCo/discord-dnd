import { Class } from "..";
import { items } from "@/game/items";

export const barbarian: Class = {
    id: "barbarian",
    title: "Barbarian",
    startingItems: [
        items.totemNecklace,
        items.ruggedCloak,
        items.ancestralGreataxe,
    ],
};
