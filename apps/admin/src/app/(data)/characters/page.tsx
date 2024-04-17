import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "campaignId",
        label: "Campaign ID",
        type: "dropdown",
    },
    {
        name: "raceId",
        label: "Race ID",
        type: "dropdown",
    },
    {
        name: "subraceId",
        label: "Subrace ID",
        type: "dropdown",
    },
    {
        name: "backgroundId",
        label: "Background ID",
        type: "dropdown",
    },
    {
        name: "name",
        label: "Name",
        type: "text",
    },
    {
        name: "description",
        label: "Description",
        type: "text",
    },
    {
        name: "imageUrl",
        label: "Image URL",
        type: "text",
    },
    {
        name: "pronouns",
        label: "Pronouns",
        type: "text",
    },
    {
        name: "age",
        label: "Age",
        type: "number",
    },
    {
        name: "voice",
        label: "Voice",
        type: "text",
    },
    {
        name: "alignment",
        label: "Alignment",
        type: "text", // TODO: make dropdown
    },
    {
        name: "appearance",
        label: "Appearance",
        type: "text",
    },
    {
        name: "backstory",
        label: "Backstory",
        type: "textarea",
    },
    {
        name: "personality",
        label: "Personality",
        type: "textarea",
    },
    {
        name: "ideals",
        label: "Ideals",
        type: "textarea",
    },
    {
        name: "bonds",
        label: "Bonds",
        type: "textarea",
    },
    {
        name: "flaws",
        label: "Flaws",
        type: "textarea",
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
