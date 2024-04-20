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
        type: "foreignkeyarray",
        dataType: "race",
        name: "races",
        label: "Races",
        required: false,
    },
];

export default async function Languages() {
    const languages = await db.language.findMany({
        include: {
            races: true,
        },
    });

    return (
        <DataCardDisplay
            data={languages}
            dataType='language'
            inputFields={inputFields}
        />
    );
}
