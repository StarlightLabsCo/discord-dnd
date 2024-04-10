import { Race } from "..";

import baseImage from "./baseImage.png";
import barbarian from "./classPortraitImages/barbarian.png";
import bard from "./classPortraitImages/bard.png";
import cleric from "./classPortraitImages/cleric.png";
import druid from "./classPortraitImages/druid.png";
import fighter from "./classPortraitImages/fighter.png";
import monk from "./classPortraitImages/monk.png";
import paladin from "./classPortraitImages/paladin.png";
import ranger from "./classPortraitImages/ranger.png";
import rogue from "./classPortraitImages/rogue.png";
import sorcerer from "./classPortraitImages/sorcerer.png";
import warlock from "./classPortraitImages/warlock.png";
import wizard from "./classPortraitImages/wizard.png";

export const halfOrc: Race = {
    id: "halfOrc",
    title: "Half-Orc",
    baseImage,
    classPortraitImages: {
        barbarian,
        bard,
        cleric,
        druid,
        fighter,
        monk,
        paladin,
        ranger,
        rogue,
        sorcerer,
        warlock,
        wizard,
    },
};
