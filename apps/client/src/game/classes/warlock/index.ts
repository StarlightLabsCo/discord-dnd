import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

export const warlock: Class = {
    id: "warlock",
    title: "Warlock",
    mainAbility: abilities.charisma,
    startingItems: [items.pactStone, items.eldritchAmulet, items.bookOfShadows],
    startingSkills: [skills.arcana, skills.deception],
};
