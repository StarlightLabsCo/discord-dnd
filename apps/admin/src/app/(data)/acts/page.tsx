import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";
import { InputField } from "@/components/data/InputFieldMapper";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "campaign",
        name: "campaignId",
        label: "Campaign ID",
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
        dataType: "adventure",
        name: "adventures",
        label: "Adventures",
        required: false,
    },
];

export default async function Acts() {
    const acts = await db.act.findMany({
        include: {
            adventures: true,
        },
    });

    return (
        <DataCardDisplay data={acts} dataType='act' inputFields={inputFields} />
    );
}
