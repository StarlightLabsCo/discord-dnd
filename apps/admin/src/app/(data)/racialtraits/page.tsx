import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "raceId",
        label: "Race ID",
        type: "dropdown",
    },
    {
        name: "subraceId",
        label: "Subrace ID",
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

export default async function Racialtraits() {
    const racialTraits = await db.racialTrait.findMany();

    return (
        <GenericCardDisplay
            data={racialTraits}
            dataType='racialTrait'
            inputFields={inputFields}
        />
    );
}
