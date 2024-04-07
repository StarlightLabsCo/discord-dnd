import { dragonborn } from "./dragonborn";
import { dwarf } from "./dwarf";
import { elf } from "./elf";
import { gnome } from "./gnome";
import { halfElf } from "./halfElf";
import { halfling } from "./halfling";
import { halfOrc } from "./halfOrc";
import { human } from "./human";
import { tiefling } from "./tiefling";

export type Race = {
    id: string;
    title: string;
    baseImage: string;
    classPortraitImages: {
        [key: string]: string;
    };
};

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
