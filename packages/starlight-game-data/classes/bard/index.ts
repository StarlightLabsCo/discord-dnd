import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const bard: Class = {
    id: "bard",
    title: "Bard",
    mainAbility: abilities.charisma,
    startingItems: [
        items.finelyCraftedLute,
        items.bookOfLore,
        items.elixirOfCharm,
    ],
    startingSkills: [skills.performance, skills.deception],
};
