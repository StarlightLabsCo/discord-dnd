import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const barbarian: Class = {
    id: "barbarian",
    title: "Barbarian",
    mainAbility: abilities.strength,
    startingItems: [
        items.totemNecklace,
        items.ruggedCloak,
        items.ancestralGreataxe,
    ],
    startingSkills: [skills.athletics, skills.intimidation],
};
