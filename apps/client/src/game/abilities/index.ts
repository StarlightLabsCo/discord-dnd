import { strength } from "./strength";
import { dexterity } from "./dexterity";
import { constitution } from "./constitution";
import { intelligence } from "./intelligence";
import { wisdom } from "./wisdom";
import { charisma } from "./charisma";

export type Ability = {
    id: string;
    title: string;
    label: string;
    min: number;
    max: number;
};

export const abilities: Record<string, Ability> = {
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
};

export type AbilityScores = {
    [key in keyof typeof abilities]: number;
};
