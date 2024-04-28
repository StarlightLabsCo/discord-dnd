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

export type InstanceStateResponse = z.infer<
    typeof InstanceStateResponseZodSchema
>;

export const InstanceStateResponseZodSchema = z.object({
    type: z.literal("InstanceStateResponse"),
    data: InstanceStateSchema,
});

export type InstanceStatePatchResponse = z.infer<
    typeof InstanceStatePatchResponseZodSchema
>;

export const InstanceStatePatchResponseZodSchema = z.object({
    type: z.literal("InstanceStatePatchResponse"),
    data: JsonPatchDocumentSchema,
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
    InstanceStateResponse: InstanceStateResponseZodSchema,
    ErrorResponse: ErrorResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
