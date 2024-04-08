import { Class } from "..";
import { items } from "@/game/items";

export const fighter: Class = {
    id: "fighter",
    title: "Fighter",
    startingItems: [
        items.sharpeningStone,
        items.heavyCloak,
        items.combatManual,
    ],
};
