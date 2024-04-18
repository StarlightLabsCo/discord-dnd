import db from "@/lib/db";
import { BeatType } from "database";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { InputField } from "@/components/InputFieldMapper";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "adventure",
        name: "adventureId",
        label: "Adventure ID",
        required: true,
    },
    {
        type: "enum",
        enumObject: BeatType,
        name: "type",
        label: "Type",
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

export default async function Beats() {
    const beats = await db.beat.findMany();

    return (
        <GenericCardDisplay
            data={beats}
            dataType='beat'
            inputFields={inputFields}
        />
    );
}
