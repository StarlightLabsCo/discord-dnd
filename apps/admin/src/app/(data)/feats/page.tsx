import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";
import { InputField } from "@/components/data/InputFieldMapper";

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
        type: "text",
        name: "prerequisites",
        label: "Prerequisites",
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

export default async function Feats() {
    const feats = await db.feat.findMany({
        include: {
            characters: true,
            characterInstances: true,
        },
    });

    return (
        <DataCardDisplay
            data={feats}
            dataType='feat'
            inputFields={inputFields}
        />
    );
}
