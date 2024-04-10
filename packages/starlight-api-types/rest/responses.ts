import { z } from "zod";

export type GenerateCharacterResponse = z.infer<
    typeof GenerateCharacterResponseZodSchema
>;

export const GenerateCharacterResponseZodSchema = z.object({
    imageUrl: z.string(),
});

const responseTypeToSchema = {
    GenerateCharacterResponse: GenerateCharacterResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
