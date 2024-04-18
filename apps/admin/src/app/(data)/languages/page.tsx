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
        type: "text",
        name: "imageUrl",
        label: "Image URL",
        required: true,
    },
    // TODO: Uh oh, I don't know how to do many-to-many relationships yet
    // {
    //     type: "foreignkeyarray",
    //     dataType: "race",
    //     foreignKeyField: "languageId",
    //     name: "races",
    //     label: "Races",
    //     required: false,
    // },
];

export default async function Languages() {
    const languages = await db.language.findMany();

    return (
        <GenericCardDisplay
            data={languages}
            dataType='language'
            inputFields={inputFields}
        />
    );
}
