import z from "zod";

export type LobbyReadyRequest = z.infer<typeof LobbyReadyRequestZodSchema>;

export const LobbyReadyRequestZodSchema = z.object({
    type: z.literal("LobbyReadyRequest"),
    data: z.object({
        ready: z.boolean(),
    }),
});

const requestTypeToSchema = {
    LobbyReadyRequest: LobbyReadyRequestZodSchema,
};

export function getRequestSchema(type: keyof typeof requestTypeToSchema) {
    return requestTypeToSchema[type];
}
