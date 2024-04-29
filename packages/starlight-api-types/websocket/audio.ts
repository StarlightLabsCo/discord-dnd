import z from "zod";

export const AudioCharacterTimingsZodSchema = z.object({
    chars: z.array(z.string()),
    charStartTimesMs: z.array(z.number()),
    charDurationsMs: z.array(z.number()),
});

export type AudioCharacterTimings = z.infer<
    typeof AudioCharacterTimingsZodSchema
>;

export const AudioWordTimingsZodSchema = z.object({
    words: z.array(z.string()),
    wordStartTimesMs: z.array(z.number()),
    wordDurationsMs: z.array(z.number()),
});

export type AudioWordTimings = z.infer<typeof AudioWordTimingsZodSchema>;
