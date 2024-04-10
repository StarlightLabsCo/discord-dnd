import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const sorcerer: Class = {
    id: "sorcerer",
    title: "Sorcerer",
    mainAbility: abilities.charisma,
    startingItems: [
        items.arcaneFocus,
        items.cloakOfTheStars,
        items.bookOfAncestors,
    ],
    startingSkills: [skills.arcana, skills.deception],
};
