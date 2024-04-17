import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "adventureId",
        label: "Adventure ID",
        type: "dropdown",
    },
    {
        name: "type",
        label: "Type",
        type: "text",
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

export default async function Beats() {
    const beats = await db.beat.findMany();

    return (
        <GenericCardDisplay
            data={beats}
            dataType='beat'
            inputFields={inputFields}
        />
    );
}
