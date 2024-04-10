import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const fighter: Class = {
    id: "fighter",
    title: "Fighter",
    mainAbility: abilities.strength,
    startingItems: [
        items.sharpeningStone,
        items.heavyCloak,
        items.combatManual,
    ],
    startingSkills: [skills.athletics, skills.intimidation],
};
