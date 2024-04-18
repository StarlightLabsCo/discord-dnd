import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { InputField } from "@/components/InputFieldMapper";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "act",
        name: "actId",
        label: "Act ID",
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
        type: "foreignkeyarray",
        dataType: "beat",
        name: "beats",
        label: "Beats",
        required: false,
    },
];

export default async function Adventures() {
    const adventures = await db.adventure.findMany({
        include: {
            act: true,
            beats: true,
        },
    });

    return (
        <GenericCardDisplay
            data={adventures}
            dataType='adventure'
            inputFields={inputFields}
        />
    );
}
