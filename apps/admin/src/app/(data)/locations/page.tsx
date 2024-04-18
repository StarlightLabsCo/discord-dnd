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
        type: "foreignkey",
        dataType: "location",
        name: "parentLocationId",
        label: "Parent Location ID",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "location",
        name: "subLocations",
        label: "Sub Locations",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "character",
        name: "characters",
        label: "Characters",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "characterInstance",
        name: "characterInstances",
        label: "Character Instances",
        required: false,
    },
];

export default async function Locations() {
    const locations = await db.location.findMany({
        include: {
            subLocations: true,
            characters: true,
            characterInstances: true,
        },
    });

    return (
        <GenericCardDisplay
            data={locations}
            dataType='location'
            inputFields={inputFields}
        />
    );
}
