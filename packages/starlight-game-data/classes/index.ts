import { z } from "zod";

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

import { AbilityZodSchema } from "@/abilities";
import { ItemZodSchema } from "@/items";
import { SkillZodSchema } from "@/skills";

export type Class = z.infer<typeof ClassZodSchema>;

export const ClassZodSchema = z.object({
    id: z.string(),
    title: z.string(),
    mainAbility: AbilityZodSchema,
    startingItems: z.array(ItemZodSchema), // TODO: this should eventually be based on background rather than class
    startingSkills: z.array(SkillZodSchema), // TODO: this should eventually be based on background rather than class
});

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
