import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const monk: Class = {
    id: "monk",
    title: "Monk",
    mainAbility: abilities.dexterity,
    startingItems: [
        items.wristWrapsOfTheWind,
        items.teaOfClarity,
        items.bambooFlute,
    ],
    startingSkills: [skills.acrobatics, skills.stealth],
};
