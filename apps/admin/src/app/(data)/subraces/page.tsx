import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";
import { InputField } from "@/components/data/InputFieldMapper";
import { CharacterSize } from "database";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "race",
        name: "parentRaceId",
        label: "Parent Race ID",
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
        type: "number",
        name: "strengthModifier",
        label: "Strength Modifier",
        required: false,
    },
    {
        type: "number",
        name: "dexterityModifier",
        label: "Dexterity Modifier",
        required: false,
    },
    {
        type: "number",
        name: "constitutionModifier",
        label: "Constitution Modifier",
        required: false,
    },
    {
        type: "number",
        name: "intelligenceModifier",
        label: "Intelligence Modifier",
        required: false,
    },
    {
        type: "number",
        name: "wisdomModifier",
        label: "Wisdom Modifier",
        required: false,
    },
    {
        type: "number",
        name: "charismaModifier",
        label: "Charisma Modifier",
        required: false,
    },
    {
        type: "enum",
        enumObject: CharacterSize,
        name: "size",
        label: "Size",
        required: false,
    },
    {
        type: "number",
        name: "speed",
        label: "Speed",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "racialTrait",
        name: "racialTraits",
        label: "Racial Traits",
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

export default async function Subraces() {
    const subraces = await db.subrace.findMany({
        include: {
            parentRace: true,
            racialTraits: true,
            characters: true,
        },
    });

    return (
        <DataCardDisplay
            data={subraces}
            dataType='subrace'
            inputFields={inputFields}
        />
    );
}
