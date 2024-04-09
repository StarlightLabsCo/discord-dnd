import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

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
