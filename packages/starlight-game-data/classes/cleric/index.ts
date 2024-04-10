import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

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
