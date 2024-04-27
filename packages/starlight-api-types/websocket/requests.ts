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

const requestTypeToSchema = {
    LobbyReadyRequest: LobbyReadyRequestZodSchema,
    CharacterSelectRequest: CharacterSelectRequestZodSchema,
    SendMessageRequest: SendMessageRequestZodSchema,
};

export function getRequestSchema(type: keyof typeof requestTypeToSchema) {
    return requestTypeToSchema[type];
}
