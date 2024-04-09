import { barbarian } from "./barbarian";
import { bard } from "./bard";
import { cleric } from "./cleric";
import { druid } from "./druid";
import { fighter } from "./fighter";
import { monk } from "./monk";
import { paladin } from "./paladin";
import { ranger } from "./ranger";
import { rogue } from "./rogue";
import { sorcerer } from "./sorcerer";
import { warlock } from "./warlock";
import { wizard } from "./wizard";

import { Ability } from "@/game/abilities";
import { Item } from "@/game/items";
import { Skill } from "@/game/skills";

export type Class = {
    id: string;
    title: string;
    mainAbility: Ability; 
    startingItems: Item[]; // TODO: this should eventually be based on background
    startingSkills: Skill[]; // TODO: this should eventually be based on background
};

export const classes: Record<string, Class> = {
    barbarian,
    bard,
    cleric,
    druid,
    fighter,
    monk,
    paladin,
    ranger,
    rogue,
    sorcerer,
    warlock,
    wizard,
};
