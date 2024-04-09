import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

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
