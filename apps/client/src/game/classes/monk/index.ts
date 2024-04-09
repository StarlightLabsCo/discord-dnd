import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

export const monk: Class = {
    id: "monk",
    title: "Monk",
    mainAbility: abilities.dexterity,
    startingItems: [
        items.wristWrapsOfTheWind,
        items.teaOfClarity,
        items.bambooFlute,
    ],
    startingSkills: [skills.acrobatics, skills.meditation],
};
