import { Class } from "..";

import { abilities } from "@/abilities";
import { items } from "@/items";
import { skills } from "@/skills";

export const paladin: Class = {
    id: "paladin",
    title: "Paladin",
    mainAbility: abilities.strength,
    startingItems: [
        items.symbolOfAuthority,
        items.vialOfSacredOil,
        items.prayerBook,
    ],
    startingSkills: [skills.religion, skills.insight],
};
