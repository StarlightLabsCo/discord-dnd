import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "parentRaceId",
        label: "Race ID",
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

export default async function Subraces() {
    const subraces = await db.subrace.findMany();

    return (
        <GenericCardDisplay
            data={subraces}
            dataType='subrace'
            inputFields={inputFields}
        />
    );
}
