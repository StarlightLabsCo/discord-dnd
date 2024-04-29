import z from "zod";
import { UserSchema } from "database/prisma/generated/zod";
import { InstanceStateSchema } from "./state";
import { JsonPatchDocumentSchema } from "./patch";

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
        buffer: z.string(),
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
    BufferAudio: BufferAudioResponseZodSchema,
    ErrorResponse: ErrorResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
