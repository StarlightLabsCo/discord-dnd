import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "worldId",
        type: "dropdown",
        label: "World ID",
    },
    {
        name: "name",
        type: "text",
        label: "Name",
    },
    {
        name: "description",
        type: "text",
        label: "Description",
    },
    {
        name: "imageUrl",
        type: "text",
        label: "Image URL",
    },
    {
        name: "personalityTraits",
        type: "text",
        label: "Personality Traits",
    },
    {
        name: "ideals",
        type: "text",
        label: "Ideals",
    },
    {
        name: "bonds",
        type: "text",
        label: "Bonds",
    },
    {
        name: "flaws",
        type: "text",
        label: "Flaws",
    },
];

export default async function Backgrounds() {
    const backgrounds = await db.background.findMany();

    return (
        <GenericCardDisplay
            data={backgrounds}
            dataType='background'
            inputFields={inputFields}
        />
    );
}
