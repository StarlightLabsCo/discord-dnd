import z from "zod";
import { UserSchema } from "database";

export type LobbyPlayerInfoResponse = z.infer<
    typeof LobbyPlayerInfoResponseZodSchema
>;

export const LobbyPlayerInfoResponseZodSchema = z.object({
    type: z.literal("LobbyPlayerInfoResponse"),
    data: z
        .object({
            instanceId: z.string(),
            players: z.array(UserSchema),
        })
        .strict(),
});

const responseTypeToSchema = {
    LobbyPlayerInfoResponse: LobbyPlayerInfoResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
