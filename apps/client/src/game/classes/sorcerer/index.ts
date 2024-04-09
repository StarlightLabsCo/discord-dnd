import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

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
