import z from "zod";
import {
    BackgroundSchema,
    CampaignInstanceSchema,
    CampaignSchema,
    CharacterInstanceSchema,
    ClassSchema,
    ItemSchema,
    MessageSchema,
    ProficiencySchema,
    RaceSchema,
    UserSchema,
    WorldSchema,
} from "database/prisma/generated/zod";
import { AudioWordTimingsZodSchema } from "./audio";

// GAME STATE
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
    selectedCampaignInstance: CampaignInstanceSchema.merge(
        z.object({
            campaign: CampaignSchema.merge(
                z.object({
                    world: WorldSchema.merge(
                        z.object({
                            races: z.array(RaceSchema),
                            classes: z.array(ClassSchema),
                            backgrounds: z.array(
                                BackgroundSchema.merge(
                                    z.object({
                                        proficiencies:
                                            z.array(ProficiencySchema),
                                        startingEquipment: z.array(ItemSchema),
                                    })
                                )
                            ),
                        })
                    ),
                })
            ),
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
    streamedMessageId: z.string().nullable(),
    streamedMessageWordTimings: z.string().nullable(),
    rollDiceDialogOpen: z.boolean(),
});
export type InstanceState = z.infer<typeof InstanceStateSchema>;
