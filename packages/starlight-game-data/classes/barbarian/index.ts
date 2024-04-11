import { Class } from "..";

import { items } from "@/items";
import { skills } from "@/skills";

export const barbarian: Class = {
    id: "barbarian",
    title: "Barbarian",
    mainAbility: "strength",
    startingItems: [
        items.totemNecklace,
        items.ruggedCloak,
        items.ancestralGreataxe,
    ],
    startingSkills: [skills.athletics, skills.intimidation],
};
