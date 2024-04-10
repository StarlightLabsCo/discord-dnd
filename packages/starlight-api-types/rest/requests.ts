import { z } from "zod";
import { AbilityScoresZodSchema } from "starlight-game-data/abilities";
import { CharacterLoreZodSchema } from "starlight-game-data/characterLore";

export type GenerateCharacterRequest = z.infer<
    typeof GenerateCharacterRequestZodSchema
>;

export const GenerateCharacterRequestZodSchema = z.object({
    raceId: z.string(),
    classId: z.string(),
    abilityScores: AbilityScoresZodSchema,
    lore: CharacterLoreZodSchema,
});

const requestTypeToSchema = {
    GenerateCharacterRequest: GenerateCharacterRequestZodSchema,
};

export function getRequestSchema(type: keyof typeof requestTypeToSchema) {
    return requestTypeToSchema[type];
}
