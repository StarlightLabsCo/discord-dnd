import { z } from "zod";

import { strength } from "./strength";
import { dexterity } from "./dexterity";
import { constitution } from "./constitution";
import { intelligence } from "./intelligence";
import { wisdom } from "./wisdom";
import { charisma } from "./charisma";

export type Ability = z.infer<typeof AbilityZodSchema>;

export const AbilityZodSchema = z
    .object({
        id: z.string(),
        title: z.string(),
        label: z.string(),
        min: z.number().nonnegative(),
        max: z.number().nonnegative(),
    })
    .strict();

export const abilities: Record<string, Ability> = {
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
};

export type AbilityScores = z.infer<typeof AbilityScoresZodSchema>;

export const AbilityScoresZodSchema = z.object({
    strength: z.number(),
    dexterity: z.number(),
    constitution: z.number(),
    intelligence: z.number(),
    wisdom: z.number(),
    charisma: z.number(),
});
