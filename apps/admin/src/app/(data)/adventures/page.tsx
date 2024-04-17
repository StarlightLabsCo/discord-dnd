import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "actId",
        type: "dropdown",
        label: "Act ID",
    },
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

export default async function Adventures() {
    const adventures = await db.adventure.findMany();

    return (
        <GenericCardDisplay
            data={adventures}
            dataType='adventure'
            inputFields={inputFields}
        />
    );
}
