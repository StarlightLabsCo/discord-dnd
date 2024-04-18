import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { InputField } from "@/components/InputFieldMapper";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "race",
        name: "raceId",
        label: "Race ID",
        required: true,
    },
    {
        type: "foreignkey",
        dataType: "subrace",
        name: "subraceId",
        label: "Subrace ID",
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
        type: "text",
        name: "imageUrl",
        label: "Image URL",
        required: true,
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
