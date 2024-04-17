import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "campaignId", // name is the field that will be sent to the server
        type: "dropdown", // type is the type of input field
        label: "Campaign ID", // label is the text that will be displayed in the input field
    },
    {
        name: "name",
        type: "text",
        label: "Name",
    },
    {
        name: "description",
        type: "text",
        label: "Description",
    },
    {
        name: "imageUrl",
        type: "text",
        label: "Image URL",
    },
];

export default async function Acts() {
    const acts = await db.act.findMany();

    return (
        <GenericCardDisplay
            data={acts}
            dataType='act'
            inputFields={inputFields}
        />
    );
}
