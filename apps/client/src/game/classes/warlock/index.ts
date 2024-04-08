import { Class } from "..";
import { items } from "@/game/items";

export const warlock: Class = {
    id: "warlock",
    title: "Warlock",
    startingItems: [items.pactStone, items.eldritchAmulet, items.bookOfShadows],
};
