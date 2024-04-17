import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "worldId",
        label: "World ID",
        type: "dropdown",
    },
    {
        name: "name",
        label: "Name",
        type: "text",
    },
    {
        name: "description",
        label: "Description",
        type: "text",
    },
    {
        name: "imageUrl",
        label: "Image URL",
        type: "text",
    },
];

export default async function Classes() {
    const classes = await db.class.findMany();

    return (
        <GenericCardDisplay
            data={classes}
            dataType='class'
            inputFields={inputFields}
        />
    );
}
