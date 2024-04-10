import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

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
