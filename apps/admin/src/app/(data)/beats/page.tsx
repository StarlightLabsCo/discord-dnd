import db from "@/lib/db";
import { BeatType } from "database";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";
import { InputField } from "@/components/data/InputFieldMapper";

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
        type: "imageUrl",
        name: "imageUrl",
        label: "Image URL",
        required: true,
    },
];

export default async function Beats() {
    const beats = await db.beat.findMany({
        include: {
            adventure: true,
        },
    });

    return (
        <DataCardDisplay
            data={beats}
            dataType='beat'
            inputFields={inputFields}
        />
    );
}
