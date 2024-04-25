import z from "zod";
import { UserSchema } from "database/prisma/generated/zod";
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

// ----- Response Schema -----
const responseTypeToSchema = {
    UserInfoResponse: UserInfoResponseZodSchema,
    InstanceStateResponse: InstanceStateResponseZodSchema,
    GameStartResponse: GameStartResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
