import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const warlock: Class = {
    id: "warlock",
    title: "Warlock",
    mainAbility: abilities.charisma,
    startingItems: [items.pactStone, items.eldritchAmulet, items.bookOfShadows],
    startingSkills: [skills.arcana, skills.deception],
};
