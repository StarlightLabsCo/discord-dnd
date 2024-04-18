import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { SpellSchool } from "database";
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
        type: "text",
        name: "imageUrl",
        label: "Image URL",
        required: true,
    },
    {
        type: "number",
        name: "level",
        label: "Level",
        required: true,
    },
    {
        type: "enum",
        enumObject: SpellSchool,
        name: "school",
        label: "School",
        required: true,
    },
    {
        type: "text",
        name: "castingTime",
        label: "Casting Time",
        required: true,
    },
    {
        type: "number",
        name: "range",
        label: "Range",
        required: true,
    },
    {
        type: "textarray",
        name: "components",
        label: "Components",
        required: true,
    },
    {
        type: "text",
        name: "duration",
        label: "Duration",
        required: true,
    },
    {
        type: "checkbox",
        name: "ritual",
        label: "Ritual",
        required: true,
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
