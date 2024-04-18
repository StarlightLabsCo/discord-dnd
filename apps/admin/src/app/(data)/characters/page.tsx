import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { CharacterAlignment, CharacterSize, Dice } from "database";
import { InputField } from "@/components/InputFieldMapper";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "campaign",
        name: "campaignId",
        label: "Campaign ID",
        required: true,
    },
    {
        type: "foreignkey",
        dataType: "race",
        name: "raceId",
        label: "Race ID",
        required: true,
    },
    {
        type: "foreignkey",
        dataType: "subrace",
        name: "subraceId",
        label: "Subrace ID",
        required: true,
    },
    {
        type: "foreignkey",
        dataType: "background",
        name: "backgroundId",
        label: "Background ID",
        required: true,
    },
    {
        type: "text",
        name: "name",
        label: "Name",
        required: true,
    },
    {
        type: "text",
        name: "description",
        label: "Description",
        required: true,
    },
    {
        type: "imageUrl",
        name: "imageUrl",
        label: "Image URL",
        required: true,
    },
    {
        type: "text",
        name: "pronouns",
        label: "Pronouns",
        required: true,
    },
    {
        type: "number",
        name: "age",
        label: "Age",
        required: true,
    },
    {
        type: "text",
        name: "voice",
        label: "Voice",
        required: true,
    },
    {
        type: "enum",
        enumObject: CharacterAlignment,
        name: "alignment",
        label: "Alignment",
        required: true,
    },
    {
        type: "text",
        name: "appearance",
        label: "Appearance",
        required: true,
    },
    {
        type: "textarea",
        name: "backstory",
        label: "Backstory",
        required: true,
    },
    {
        type: "textarray",
        name: "personalityTraits",
        label: "Personality Traits",
        required: true,
    },
    {
        type: "textarray",
        name: "ideals",
        label: "Ideals",
        required: true,
    },
    {
        type: "textarray",
        name: "bonds",
        label: "Bonds",
        required: true,
    },
    {
        type: "textarray",
        name: "flaws",
        label: "Flaws",
        required: true,
    },
    {
        type: "enum",
        enumObject: CharacterSize,
        name: "size",
        label: "Size",
        required: true,
    },
    {
        type: "number",
        name: "speed",
        label: "Speed",
        required: true,
    },
    {
        type: "foreignkeyarray",
        dataType: "class",
        name: "classes",
        label: "Classes",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "feat",
        name: "feats",
        label: "Feats",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "item",
        name: "inventory",
        label: "Inventory",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "spell",
        name: "spells",
        label: "Spells",
        required: false,
    },
    {
        type: "number",
        name: "level",
        label: "Level",
        required: true,
    },
    {
        type: "number",
        name: "experience",
        label: "Experience",
        required: true,
    },
    {
        type: "number",
        name: "proficiencyBonus",
        label: "Proficiency Bonus",
        required: true,
    },
    {
        type: "foreignkeyarray",
        dataType: "proficiency",
        name: "proficiencies",
        label: "Proficiencies",
        required: false,
    },
    {
        type: "number",
        name: "strength",
        label: "Strength",
        required: true,
    },
    {
        type: "number",
        name: "dexterity",
        label: "Dexterity",
        required: true,
    },
    {
        type: "number",
        name: "constitution",
        label: "Constitution",
        required: true,
    },
    {
        type: "number",
        name: "intelligence",
        label: "Intelligence",
        required: true,
    },
    {
        type: "number",
        name: "wisdom",
        label: "Wisdom",
        required: true,
    },
    {
        type: "number",
        name: "charisma",
        label: "Charisma",
        required: true,
    },
    {
        type: "number",
        name: "hitDieCount",
        label: "Hit Die Count",
        required: true,
    },
    {
        type: "enum",
        enumObject: Dice,
        name: "hitDieType",
        label: "Hit Die Type",
        required: true,
    },
    {
        type: "number",
        name: "healthPoints",
        label: "Health Points",
        required: true,
    },
];

export default async function Characters() {
    const characters = await db.character.findMany();

    return (
        <GenericCardDisplay
            data={characters}
            dataType='character'
            inputFields={inputFields}
        />
    );
}
