import { z } from "zod";

export type PostImageRequest = z.infer<typeof PostImageRequestZodSchema>;

export const PostImageRequestZodSchema = z.object({
    raceId: z.string(),
    classId: z.string(),

    name: z.string(),
    pronouns: z.string(),
    age: z.number(),
    voice: z.string(),
    alignment: z.string(),
    appearance: z.string(),
    backstory: z.string(),
    personality: z.string(),
    ideals: z.string(),
    bonds: z.string(),
    flaws: z.string(),

    strength: z.number(),
    dexterity: z.number(),
    constitution: z.number(),
    intelligence: z.number(),
    wisdom: z.number(),
    charisma: z.number(),
});

export type PostCharacterRequest = z.infer<
    typeof PostCharacterRequestZodSchema
>;

export const PostCharacterRequestZodSchema = z.object({
    originId: z.string(),
    raceId: z.string(),
    subraceId: z.string(),
    classId: z.string(),

    name: z.string(),
    pronouns: z.string(),
    age: z.number(),
    voice: z.string(),
    alignment: z.string(),
    appearance: z.string(),
    backstory: z.string(),
    personality: z.string(),
    ideals: z.string(),
    bonds: z.string(),
    flaws: z.string(),

    strength: z.number(),
    dexterity: z.number(),
    constitution: z.number(),
    intelligence: z.number(),
    wisdom: z.number(),
    charisma: z.number(),

    imageUrl: z.string(),
});

export type PatchCharacterRequest = z.infer<
    typeof PatchCharacterRequestZodSchema
>;

export const PatchCharacterRequestZodSchema = z.object({
    characterId: z.string(),
    character: z.object({
        originId: z.string().optional(),
        raceId: z.string().optional(),
        subraceId: z.string().optional(),
        classId: z.string().optional(),

        name: z.string().optional(),
        pronouns: z.string().optional(),
        age: z.number().optional(),
        voice: z.string().optional(),
        alignment: z.string().optional(),
        appearance: z.string().optional(),
        backstory: z.string().optional(),
        personality: z.string().optional(),
        ideals: z.string().optional(),
        bonds: z.string().optional(),
        flaws: z.string().optional(),

        strength: z.number().optional(),
        dexterity: z.number().optional(),
        constitution: z.number().optional(),
        intelligence: z.number().optional(),
        wisdom: z.number().optional(),
        charisma: z.number().optional(),

        imageUrl: z.string().optional(),
    }),
});

const requestTypeToSchema = {
    PostImageRequestZodSchema,
    PostCharacterRequestZodSchema,
    PatchCharacterRequestZodSchema,
};

export function getRequestSchema(type: keyof typeof requestTypeToSchema) {
    return requestTypeToSchema[type];
}
