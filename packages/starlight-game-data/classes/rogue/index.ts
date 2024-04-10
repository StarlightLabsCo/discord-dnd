import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const rogue: Class = {
    id: "rogue",
    title: "Rogue",
    mainAbility: abilities.dexterity,
    startingItems: [
        items.lockpickSet,
        items.darkCommonClothes,
        items.goldPouch,
    ],
    startingSkills: [skills.stealth, skills.sleightOfHand],
};
