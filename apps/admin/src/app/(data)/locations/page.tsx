import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "worldId",
        type: "dropdown",
        label: "World ID",
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
    {
        name: "parentLocationId",
        type: "dropdown",
        label: "Parent Location ID",
    },
];

export default async function Locations() {
    const locations = await db.location.findMany();

    return (
        <GenericCardDisplay
            data={locations}
            dataType='location'
            inputFields={inputFields}
        />
    );
}
