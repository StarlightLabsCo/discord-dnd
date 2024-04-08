import { Class } from "..";
import { items } from "@/game/items";

export const ranger: Class = {
    id: "ranger",
    title: "Ranger",
    startingItems: [
        items.compassOfThePathfinder,
        items.trappersKit,
        items.arrowOfBeastSlaying,
    ],
};
