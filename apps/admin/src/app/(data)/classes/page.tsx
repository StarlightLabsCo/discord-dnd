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
        type: "foreignkeyarray",
        dataType: "classFeature",
        name: "classFeatures",
        label: "Class Features",
        required: false,
    },
];

export default async function Classes() {
    const classes = await db.class.findMany({
        include: {
            classFeatures: true,
        },
    });

    return (
        <GenericCardDisplay
            data={classes}
            dataType='class'
            inputFields={inputFields}
        />
    );
}
