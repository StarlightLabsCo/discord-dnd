import { z } from "zod";

export type PostImageResponse = z.infer<typeof PostImageResponseZodSchema>;

export const PostImageResponseZodSchema = z.object({
    imageUrl: z.string(),
});

const responseTypeToSchema = {
    PostImageResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
