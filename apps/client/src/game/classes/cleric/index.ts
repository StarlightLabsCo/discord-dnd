import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

export const cleric: Class = {
    id: "cleric",
    title: "Cleric",
    mainAbility: abilities.wisdom,
    startingItems: [
        items.blessedSymbol,
        items.vialOfHolyWater,
        items.prayerBeads,
    ],
    startingSkills: [skills.religion, skills.insight],
};
