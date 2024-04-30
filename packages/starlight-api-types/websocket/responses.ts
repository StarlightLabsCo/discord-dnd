import z from "zod";
import { UserSchema } from "database/prisma/generated/zod";
import { JsonPatchDocumentSchema } from "./patch";
import { AudioWordTimingsZodSchema } from "./audio";

// ----- UserInfoResponse -----
export type UserInfoResponse = z.infer<typeof UserInfoResponseZodSchema>;

export const UserInfoResponseZodSchema = z.object({
    type: z.literal("UserInfoResponse"),
    data: UserSchema,
});

export type InstanceStatePatchResponse = z.infer<
    typeof InstanceStatePatchResponseZodSchema
>;

export const InstanceStatePatchResponseZodSchema = z.object({
    type: z.literal("InstanceStatePatchResponse"),
    data: JsonPatchDocumentSchema,
});

export type BufferAudioResponse = z.infer<typeof BufferAudioResponseZodSchema>;

export const BufferAudioResponseZodSchema = z.object({
    type: z.literal("BufferAudioResponse"),
    data: z.object({
        messageId: z.string(),
        buffer: z.string(),
        start: z.boolean(),
    }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseZodSchema>;

export const ErrorResponseZodSchema = z.object({
    type: z.literal("ErrorResponse"),
    data: z.object({
        error: z.string(),
    }),
});

// ----- Response Schema -----
const responseTypeToSchema = {
    UserInfoResponse: UserInfoResponseZodSchema,
    InstanceStatePatchResponse: InstanceStatePatchResponseZodSchema,
    BufferAudioResponse: BufferAudioResponseZodSchema,
    ErrorResponse: ErrorResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
