import { Class } from "..";
import { items } from "@/game/items";

export const sorcerer: Class = {
    id: "sorcerer",
    title: "Sorcerer",
    startingItems: [
        items.arcaneFocus,
        items.cloakOfTheStars,
        items.bookOfAncestors,
    ],
};
