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

export default async function Races() {
    const races = await db.race.findMany();

    return (
        <GenericCardDisplay
            data={races}
            dataType='race'
            inputFields={inputFields}
        />
    );
}
