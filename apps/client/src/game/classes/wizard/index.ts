import { Class } from "..";
import { items } from "@/game/items";

export const wizard: Class = {
    id: "wizard",
    title: "Wizard",
    startingItems: [
        items.spellScroll,
        items.wizardsRobe,
        items.arcaneCompanion,
    ],
};
