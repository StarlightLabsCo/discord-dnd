import z from "zod";
import {
    BackgroundSchema,
    CampaignInstanceSchema,
    CampaignSchema,
    CharacterInstanceSchema,
    ClassFeatureSchema,
    ClassSchema,
    FeatSchema,
    ItemSchema,
    MessageSchema,
    ProficiencySchema,
    RaceSchema,
    RacialTraitSchema,
    UserSchema,
    WorldSchema,
} from "database/prisma/generated/zod";

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

export const RollDiceInfoSchema = z.object({
    toolCallId: z.string(),
    characterInstanceId: z.string(),
    check: z.string(),
    subCheck: z.string(),
    difficulty: z.number(),
    state: z.enum(["ready", "rolling", "complete"]),
    result: z.number().nullable(),
});
export type RollDiceInfo = z.infer<typeof RollDiceInfoSchema>;

export const InstanceStateSchema = z.object({
    state: GameStateSchema,
    connectedPlayers: z.array(LobbyPlayerSchema),
    selectedCampaignInstance: CampaignInstanceSchema.merge(
        z.object({
            campaign: CampaignSchema.merge(
                z.object({
                    world: WorldSchema.merge(
                        z.object({
                            races: z.array(
                                RaceSchema.merge(
                                    z.object({
                                        racialTraits:
                                            z.array(RacialTraitSchema),
                                    })
                                )
                            ),
                            classes: z.array(
                                ClassSchema.merge(
                                    z.object({
                                        proficiencies:
                                            z.array(ProficiencySchema),
                                        startingEquipment: z.array(ItemSchema),
                                        classFeatures:
                                            z.array(ClassFeatureSchema),
                                    })
                                )
                            ),
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
                        proficiencies: z.array(ProficiencySchema),
                        feats: z.array(FeatSchema),
                        inventory: z.array(ItemSchema),
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
    rollDiceInfo: z.union([RollDiceInfoSchema, z.null()]),
});
export type InstanceState = z.infer<typeof InstanceStateSchema>;
