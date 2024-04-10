import { z } from "zod";

export type CharacterLore = z.infer<typeof CharacterLoreZodSchema>;

export const CharacterLoreZodSchema = z.object({
    name: z.string(),
    pronouns: z.string(),
    age: z.string(),
    voice: z.string(),
    alignment: z.string(),
    appearance: z.string(),
    backstory: z.string(),
    personality: z.string(),
    ideals: z.string(),
    bonds: z.string(),
    flaws: z.string(),
});
