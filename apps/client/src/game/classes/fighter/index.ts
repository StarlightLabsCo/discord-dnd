import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

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
