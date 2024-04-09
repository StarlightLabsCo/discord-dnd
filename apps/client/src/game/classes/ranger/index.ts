import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

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
