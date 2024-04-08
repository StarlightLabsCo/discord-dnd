import { animalWhistle } from "./animalWhistle";
import { ancestralGreataxe } from "./ancestralGreataxe";
import { arcaneCompanion } from "./arcaneCompanion";
import { arcaneFocus } from "./arcaneFocus";
import { arrowOfBeastSlaying } from "./arrowOfBeastSlaying";
import { bambooFlute } from "./bambooFlute";
import { blessedSymbol } from "./blessedSymbol";
import { bookOfAncestors } from "./bookOfAncestors";
import { bookOfLore } from "./bookOfLore";
import { bookOfShadows } from "./bookOfShadows";
import { cloakOfLeaves } from "./cloakOfLeaves";
import { cloakOfTheStars } from "./cloakOfTheStars";
import { combatManual } from "./combatManual";
import { compassOfThePathfinder } from "./compassOfThePathfinder";
import { crowbar } from "./crowbar";
import { darkCommonClothes } from "./darkCommonClothes";
import { eldritchAmulet } from "./eldritchAmulet";
import { elixirOfCharm } from "./elixirOfCharm";
import { finelyCraftedLute } from "./finelyCraftedLute";
import { goldPouch } from "./goldPouch";
import { heavyCloak } from "./heavyCloak";
import { herbalismKit } from "./herbalismKit";
import { lockpickSet } from "./lockpickSet";
import { pactStone } from "./pactStone";
import { poisonVial } from "./poisonVial";
import { prayerBeads } from "./prayerBeads";
import { prayerBook } from "./prayerBook";
import { ruggedCloak } from "./ruggedCloak";
import { sharpeningStone } from "./sharpeningStone";
import { spellScroll } from "./spellScroll";
import { symbolOfAuthority } from "./symbolOfAuthority";
import { teaOfClarity } from "./teaOfClarity";
import { totemNecklace } from "./totemNecklace";
import { trappersKit } from "./trappersKit";
import { vialOfHolyWater } from "./vialOfHolyWater";
import { vialOfSacredOil } from "./vialOfSacredOil";
import { wizardsRobe } from "./wizardsRobe";
import { wristWrapsOfTheWind } from "./wristWrapsOfTheWind";

export type Item = {
    id: string;
    title: string;
    description: string;
    image: string;
};

export const items = {
    animalWhistle,
    ancestralGreataxe,
    arcaneCompanion,
    arcaneFocus,
    arrowOfBeastSlaying,
    bambooFlute,
    blessedSymbol,
    bookOfAncestors,
    bookOfLore,
    bookOfShadows,
    cloakOfLeaves,
    cloakOfTheStars,
    combatManual,
    compassOfThePathfinder,
    crowbar,
    darkCommonClothes,
    eldritchAmulet,
    elixirOfCharm,
    finelyCraftedLute,
    goldPouch,
    heavyCloak,
    herbalismKit,
    lockpickSet,
    pactStone,
    poisonVial,
    prayerBeads,
    prayerBook,
    ruggedCloak,
    sharpeningStone,
    spellScroll,
    symbolOfAuthority,
    teaOfClarity,
    totemNecklace,
    trappersKit,
    vialOfHolyWater,
    vialOfSacredOil,
    wizardsRobe,
    wristWrapsOfTheWind,
};
