import DreamsOfMagic from "./Dreams of Magic.mp3";
import FieldsOfDestiny from "./Fields of Destiny.mp3";
import FluteLullaby from "./Flute Lullaby.mp3";
import GhostKnightsFury from "./Ghost Knight's Fury.mp3";
import HymnOfTheAncients from "./Hymn of the Ancients.mp3";
import JourneyOfHeroes from "./Journey of Heroes.mp3";
import LegendsOfTheRealm from "./Legends of the Realm.mp3";
import QuestOfDestiny from "./Quest of Destiny.mp3";
import SunoSunsetSerenade from "./Suno Sunset Serenade.mp3";
import TalesOfElvenLove from "./Tales of Elven Love.mp3";
import TalesOfTheQuest from "./Tales of the Quest.mp3";
import WarriorsOfValor from "./Warriors of Valor.mp3";
import WarriorsOfTheArcane from "./Warriors of the Arcane.mp3";

export type MusicFile = {
    name: string;
    src: string;
};

export const musicFiles = [
    { name: "Dreams of Magic", src: DreamsOfMagic },
    { name: "Fields of Destiny", src: FieldsOfDestiny },
    { name: "Flute Lullaby", src: FluteLullaby },
    { name: "Ghost Knight's Fury", src: GhostKnightsFury },
    { name: "Hymn of the Ancients", src: HymnOfTheAncients },
    { name: "Journey of Heroes", src: JourneyOfHeroes },
    { name: "Legends of the Realm", src: LegendsOfTheRealm },
    { name: "Quest of Destiny", src: QuestOfDestiny },
    { name: "Suno Sunset Serenade", src: SunoSunsetSerenade },
    { name: "Tales of Elven Love", src: TalesOfElvenLove },
    { name: "Tales of the Quest", src: TalesOfTheQuest },
    { name: "Warriors of Valor", src: WarriorsOfValor },
    { name: "Warriors of the Arcane", src: WarriorsOfTheArcane },
];
