import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { InputField } from "@/components/InputFieldMapper";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "world",
        name: "worldId",
        label: "World ID",
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
        type: "foreignkeyarray",
        dataType: "proficiency",
        name: "proficiencies",
        label: "Proficiencies",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "item",
        name: "equipment",
        label: "Equipment",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "character",
        name: "characters",
        label: "Characters",
        required: false,
    },
];

export default async function Backgrounds() {
    const backgrounds = await db.background.findMany({
        include: {
            world: true,
            proficiencies: true,
            equipment: true,
            characters: true,
        },
    });

    return (
        <GenericCardDisplay
            data={backgrounds}
            dataType='background'
            inputFields={inputFields}
        />
    );
}
