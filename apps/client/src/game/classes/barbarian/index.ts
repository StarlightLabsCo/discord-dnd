import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

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
