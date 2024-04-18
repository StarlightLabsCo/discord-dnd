import db from "@/lib/db";
import {
    GenericCardDisplay,
} from "@/components/GenericCardDisplay";
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
];

export default async function Feats() {
    const feats = await db.feat.findMany();

    return (
        <GenericCardDisplay
            data={feats}
            dataType='feat'
            inputFields={inputFields}
        />
    );
}
