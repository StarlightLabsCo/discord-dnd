import z from "zod";
import {
    CampaignInstanceSchema,
    CharacterInstanceSchema,
    MessageSchema,
    UserSchema,
} from "database/prisma/generated/zod";

export const GameStateSchema = z.enum(["LOBBY", "IN_GAME"]);
export type GameState = z.infer<typeof GameStateSchema>;

export const LobbyPlayerStatusSchema = z.enum([
    "READY",
    "NOT_READY",
    "CHARACTER_SELECT",
]);
export type LobbyPlayerStatus = z.infer<typeof LobbyPlayerStatusSchema>;

export const LobbyPlayerSchema = z.object({
    user: UserSchema,
    character: z.union([CharacterInstanceSchema, z.null()]),
    status: LobbyPlayerStatusSchema,
});
export type LobbyPlayer = z.infer<typeof LobbyPlayerSchema>;

export const InstanceStateSchema = z.object({
    state: GameStateSchema,
    connectedPlayers: z.array(LobbyPlayerSchema),
    selectedCampaign: CampaignInstanceSchema.merge(
        z.object({
            characterInstances: z.array(
                CharacterInstanceSchema.merge(
                    z.object({
                        user: z.union([UserSchema, z.null()]),
                    })
                )
            ),
            messages: z.array(
                MessageSchema.merge(
                    z.object({
                        characterInstance: z.union([
                            CharacterInstanceSchema,
                            z.null(),
                        ]),
                    })
                )
            ),
        })
    ),
});
export type InstanceState = z.infer<typeof InstanceStateSchema>;
