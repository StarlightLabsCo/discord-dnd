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

export type Skill = {
    id: string;
    title: string;
    description: string;
    image: string;
};

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
