import { Class } from "..";
import { items } from "@/game/items";

export const paladin: Class = {
    id: "paladin",
    title: "Paladin",
    startingItems: [
        items.symbolOfAuthority,
        items.vialOfSacredOil,
        items.prayerBook,
    ],
};
