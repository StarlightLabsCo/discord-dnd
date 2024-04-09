import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

export const druid: Class = {
    id: "druid",
    title: "Druid",
    mainAbility: abilities.wisdom,
    startingItems: [
        items.herbalismKit,
        items.animalWhistle,
        items.cloakOfLeaves,
    ],
    startingSkills: [skills.nature, skills.animalHandling],
};
