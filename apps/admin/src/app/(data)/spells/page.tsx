import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "worldId",
        label: "World ID",
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
        name: "level",
        label: "Level",
        type: "number",
    },
    {
        name: "school",
        label: "School",
        type: "text",
    },
    {
        name: "castingTime",
        label: "Casting Time",
        type: "text",
    },
    {
        name: "range",
        label: "Range",
        type: "text",
    },
    {
        name: "components",
        label: "Components",
        type: "text",
    },
    {
        name: "duration",
        label: "Duration",
        type: "text",
    },
    {
        name: "description",
        label: "Description",
        type: "text",
    },
    {
        name: "classes",
        label: "Classes",
        type: "text",
    },
    {
        name: "higherLevel",
        label: "Higher Level",
        type: "text",
    },
    {
        name: "material",
        label: "Material",
        type: "text",
    },
    {
        name: "ritual",
        label: "Ritual",
        type: "boolean",
    },
];

export default async function Spells() {
    const spells = await db.spell.findMany();

    return (
        <GenericCardDisplay
            data={spells}
            dataType='spell'
            inputFields={inputFields}
        />
    );
}
