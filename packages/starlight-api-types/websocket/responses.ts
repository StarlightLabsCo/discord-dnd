import z from "zod";
import {
    CharacterInstanceSchema,
    MessageSchema,
    UserSchema,
} from "database/prisma/generated/zod";
import { InstanceStateSchema } from "./state";

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

export type GameStartResponse = z.infer<typeof GameStartResponseZodSchema>;

export const GameStartResponseZodSchema = z.object({
    type: z.literal("GameStartResponse"),
    data: z.object({}),
});

export type MessageAddedResponse = z.infer<
    typeof MessageAddedResponseZodSchema
>;

export const MessageAddedResponseZodSchema = z.object({
    type: z.literal("MessageAddedResponse"),
    data: MessageSchema.merge(
        z.object({
            characterInstance: CharacterInstanceSchema,
        })
    ),
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
    GameStartResponse: GameStartResponseZodSchema,
    MessageAddedResponse: MessageAddedResponseZodSchema,
    ErrorResponse: ErrorResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
