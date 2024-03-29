import z from "zod";
import { UserSchema } from "database";

// ----- UserInfoResponse -----
export type UserInfoResponse = z.infer<typeof UserInfoResponseZodSchema>;

export const UserInfoResponseZodSchema = z.object({
    type: z.literal("UserInfoResponse"),
    data: UserSchema,
});

// ----- ConnectedPlayersInfoResponse -----
export type ConnectedPlayersInfoResponse = z.infer<
    typeof ConnectedPlayersInfoResponseZodSchema
>;

export const ConnectedPlayersInfoResponseZodSchema = z.object({
    type: z.literal("ConnectedPlayersInfoResponse"),
    data: z
        .object({
            players: z.array(UserSchema),
        })
        .strict(),
});

// ----- GameStateUpdateResponse -----
export type GameStateUpdateResponse = z.infer<
    typeof GameStateUpdateResponseZodSchema
>;

export const GameStateUpdateResponseZodSchema = z.object({
    type: z.literal("GameStateUpdateResponse"),
    data: z.object({
        readyUserIds: z.array(z.string()),
    }),
});

// ----- Response Schema -----
const responseTypeToSchema = {
    UserInfoResponse: UserInfoResponseZodSchema,
    ConnectedPlayersInfoResponse: ConnectedPlayersInfoResponseZodSchema,
    GameStateUpdateResponse: GameStateUpdateResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
