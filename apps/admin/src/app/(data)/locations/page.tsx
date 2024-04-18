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
        type: "foreignkey",
        dataType: "location",
        name: "parentLocationId",
        label: "Parent Location ID",
        required: false,
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
    {
        type: "foreignkeyarray",
        foreignKeyField: "parentLocationId",
        dataType: "location",
        name: "subLocations",
        label: "Sub Locations",
        required: false,
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
