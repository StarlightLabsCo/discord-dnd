import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { InputField } from "@/components/InputFieldMapper";

const inputFields: InputField[] = [
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
