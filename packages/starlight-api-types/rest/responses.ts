import { z } from "zod";

export const GenerateCharacterResponseZodSchema = z.object({
    imageUrl: z.string(),
});

const responseTypeToSchema = {
    GenerateCharacterResponse: GenerateCharacterResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
