import z from "zod";

export type GameStateUpdateRequest = z.infer<
    typeof GameStateUpdateRequestZodSchema
>;

export const GameStateUpdateRequestZodSchema = z.object({
    type: z.literal("GameStateUpdateRequest"),
    data: z.object({
        readyUserIds: z.array(z.string()),
    }),
});

const requestTypeToSchema = {
    GameStateUpdateRequest: GameStateUpdateRequestZodSchema,
};

export function getRequestSchema(type: keyof typeof requestTypeToSchema) {
    return requestTypeToSchema[type];
}
