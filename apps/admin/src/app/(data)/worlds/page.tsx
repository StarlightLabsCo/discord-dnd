import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "name",
        type: "text",
        label: "Name",
    },
    {
        name: "description",
        type: "text",
        label: "Description",
    },
    {
        name: "imageUrl",
        type: "text",
        label: "Image URL",
    },
];

export default async function Worlds() {
    const worlds = await db.world.findMany();

    return (
        <GenericCardDisplay
            data={worlds}
            dataType='world'
            inputFields={inputFields}
        />
    );
}
