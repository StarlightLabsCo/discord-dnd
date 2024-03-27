import z from "zod";
import { UserSchema } from "database";

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

const responseTypeToSchema = {
    ConnectedPlayersInfoResponse: ConnectedPlayersInfoResponseZodSchema,
};

export function getResponseSchema(type: keyof typeof responseTypeToSchema) {
    return responseTypeToSchema[type];
}
