import { Class } from "..";
import { items } from "@/game/items";

export const bard: Class = {
    id: "bard",
    title: "Bard",
    startingItems: [
        items.finelyCraftedLute,
        items.bookOfLore,
        items.elixirOfCharm,
    ],
};
