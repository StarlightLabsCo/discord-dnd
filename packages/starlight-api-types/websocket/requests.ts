import z from "zod";

export type LobbyReadyRequest = z.infer<typeof LobbyReadyRequestZodSchema>;

export const LobbyReadyRequestZodSchema = z.object({
    type: z.literal("LobbyReadyRequest"),
    data: z.object({
        ready: z.boolean(),
    }),
});

export type CharacterSelectRequest = z.infer<
    typeof CharacterSelectRequestZodSchema
>;

export const CharacterSelectRequestZodSchema = z.object({
    type: z.literal("CharacterSelectRequest"),
    data: z.object({
        characterInstanceId: z.string(),
    }),
});

export type SendMessageRequest = z.infer<typeof SendMessageRequestZodSchema>;

export const SendMessageRequestZodSchema = z.object({
    type: z.literal("SendMessageRequest"),
    data: z.object({
        message: z.string(),
    }),
});

// changes DiceRollInfo state to "rolling"
export type RollDiceRequest = z.infer<typeof RollDiceRequestZodSchema>;

export const RollDiceRequestZodSchema = z.object({
    type: z.literal("RollDiceRequest"),
    data: z.object({}),
});

const requestTypeToSchema = {
    LobbyReadyRequest: LobbyReadyRequestZodSchema,
    CharacterSelectRequest: CharacterSelectRequestZodSchema,
    SendMessageRequest: SendMessageRequestZodSchema,
    RollDiceRequest: RollDiceRequestZodSchema,
};

export function getRequestSchema(type: keyof typeof requestTypeToSchema) {
    return requestTypeToSchema[type];
}
