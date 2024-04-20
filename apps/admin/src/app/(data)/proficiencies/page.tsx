import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";
import { InputField } from "@/components/data/InputFieldMapper";
import { ProficiencyType } from "database";

const inputFields: InputField[] = [
    {
        type: "enum",
        enumObject: ProficiencyType,
        name: "type",
        label: "Type",
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
        type: "foreignkeyarray",
        dataType: "background",
        name: "backgrounds",
        label: "Backgrounds",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "character",
        name: "characters",
        label: "Characters",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "characterInstance",
        name: "characterInstances",
        label: "Character Instances",
        required: false,
    },
];

export default async function Proficiencies() {
    const proficiencies = await db.proficiency.findMany({
        include: {
            backgrounds: true,
            characters: true,
            characterInstances: true,
        },
    });

    return (
        <DataCardDisplay
            data={proficiencies}
            dataType='proficiency'
            inputFields={inputFields}
        />
    );
}
