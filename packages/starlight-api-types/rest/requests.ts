import {
    BackgroundSchema,
    CharacterInstanceSchema,
    ClassSchema,
    RaceSchema,
} from "database/prisma/generated/zod";
import { z } from "zod";

export type PostImageRequest = z.infer<typeof PostImageRequestZodSchema>;

export const PostImageRequestZodSchema = CharacterInstanceSchema.merge(
    z.object({
        race: RaceSchema,
        class: ClassSchema,
        background: BackgroundSchema,
    })
);

const requestTypeToSchema = {
    PostImageRequest: PostImageRequestZodSchema,
};

export function getRequestSchema(type: keyof typeof requestTypeToSchema) {
    return requestTypeToSchema[type];
}
