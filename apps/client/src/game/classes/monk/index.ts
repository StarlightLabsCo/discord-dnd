import { Class } from "..";
import { items } from "@/game/items";

export const monk: Class = {
    id: "monk",
    title: "Monk",
    startingItems: [
        items.wristWrapsOfTheWind,
        items.teaOfClarity,
        items.bambooFlute,
    ],
};
