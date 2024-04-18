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
        enumObject: "CharacterSize",
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
        dataType: "language",
        name: "languages",
        label: "Languages",
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
        dataType: "subrace",
        name: "subraces",
        label: "Subraces",
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

export default async function Races() {
    const races = await db.race.findMany({
        include: {
            languages: true,
            racialTraits: true,
            subraces: true,
            characters: true,
        },
    });

    return (
        <GenericCardDisplay
            data={races}
            dataType='race'
            inputFields={inputFields}
        />
    );
}
