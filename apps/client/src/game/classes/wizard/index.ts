import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

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
