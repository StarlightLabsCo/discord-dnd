import { z } from "zod";

import { athletics } from "./athletics";
import { acrobatics } from "./acrobatics";
import { sleightOfHand } from "./sleightOfHand";
import { stealth } from "./stealth";
import { arcana } from "./arcana";
import { history } from "./history";
import { investigation } from "./investigation";
import { nature } from "./nature";
import { religion } from "./religion";
import { animalHandling } from "./animalHandling";
import { insight } from "./insight";
import { medicine } from "./medicine";
import { perception } from "./perception";
import { survival } from "./survival";
import { deception } from "./deception";
import { intimidation } from "./intimidation";
import { performance } from "./performance";
import { persuasion } from "./persuasion";

export type Skill = z.infer<typeof SkillZodSchema>;

export const SkillZodSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
});

export const skills: Record<string, Skill> = {
    athletics,
    acrobatics,
    sleightOfHand,
    stealth,
    arcana,
    history,
    investigation,
    nature,
    religion,
    animalHandling,
    insight,
    medicine,
    perception,
    survival,
    deception,
    intimidation,
    performance,
    persuasion,
};
