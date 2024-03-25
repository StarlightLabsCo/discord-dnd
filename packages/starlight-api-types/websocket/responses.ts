import z from "zod";

type LobbyPlayerInfo = z.infer<typeof LobbyPlayerInfoZodSchema>;

export const LobbyPlayerInfoZodSchema = z.object({
    instanceId: z.string(),
    players: z.null(),
});
