import { Class } from "..";
import { items } from "@/game/items";

export const druid: Class = {
    id: "druid",
    title: "Druid",
    startingItems: [items.herbalismKit, items.animalWhistle, items.cloakOfLeaves],
};
