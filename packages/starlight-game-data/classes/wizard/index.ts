import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const wizard: Class = {
    id: "wizard",
    title: "Wizard",
    mainAbility: abilities.intelligence,
    startingItems: [
        items.spellScroll,
        items.wizardsRobe,
        items.arcaneCompanion,
    ],
    startingSkills: [skills.arcana, skills.history],
};
