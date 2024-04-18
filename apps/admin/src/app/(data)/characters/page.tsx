import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { CharacterAlignment } from "database";
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
        type: "text",
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
