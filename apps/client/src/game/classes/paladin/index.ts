import { Class } from "..";

import { abilities } from "@/game/abilities";
import { items } from "@/game/items";
import { skills } from "@/game/skills";

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
