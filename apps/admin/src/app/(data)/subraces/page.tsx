import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { InputField } from "@/components/InputFieldMapper";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "race",
        name: "parentRaceId",
        label: "Race ID",
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
        type: "number",
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
        foreignKeyField: "subraceId",
        name: "racialTraits",
        label: "Racial Traits",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "character",
        foreignKeyField: "subraceId",
        name: "characters",
        label: "Characters",
        required: false,
    },
];

export default async function Subraces() {
    const subraces = await db.subrace.findMany();

    return (
        <GenericCardDisplay
            data={subraces}
            dataType='subrace'
            inputFields={inputFields}
        />
    );
}
