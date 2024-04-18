import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { InputField } from "@/components/InputFieldMapper";

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
        <GenericCardDisplay
            data={acts}
            dataType='act'
            inputFields={inputFields}
        />
    );
}
