import { z } from "zod";

import { dragonborn } from "./dragonborn";
import { dwarf } from "./dwarf";
import { elf } from "./elf";
import { gnome } from "./gnome";
import { halfElf } from "./halfElf";
import { halfling } from "./halfling";
import { halfOrc } from "./halfOrc";
import { human } from "./human";
import { tiefling } from "./tiefling";

export type Race = z.infer<typeof RaceZodSchema>;

export const RaceZodSchema = z.object({
    id: z.string(),
    title: z.string(),
    baseImage: z.string(),
    classPortraitImages: z.record(z.string()),
});

export const races: Record<string, Race> = {
    dragonborn,
    dwarf,
    elf,
    gnome,
    halfElf,
    halfling,
    halfOrc,
    human,
    tiefling,
};
