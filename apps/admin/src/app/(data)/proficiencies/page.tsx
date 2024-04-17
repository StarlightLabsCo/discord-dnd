import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
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

export default async function Proficiencies() {
    const proficiencies = await db.proficiency.findMany();

    return (
        <GenericCardDisplay
            data={proficiencies}
            dataType='proficiency'
            inputFields={inputFields}
        />
    );
}
