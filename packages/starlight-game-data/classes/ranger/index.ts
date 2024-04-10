import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const ranger: Class = {
    id: "ranger",
    title: "Ranger",
    mainAbility: abilities.dexterity,
    startingItems: [
        items.compassOfThePathfinder,
        items.trappersKit,
        items.arrowOfBeastSlaying,
    ],
    startingSkills: [skills.survival, skills.stealth],
};
