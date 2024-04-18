import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { InputField } from "@/components/InputFieldMapper";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "world",
        name: "worldId",
        label: "World ID",
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
        dataType: "character",
        name: "characters",
        label: "Characters",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "act",
        name: "acts",
        label: "Acts",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "campaignInstance",
        name: "campaignInstances",
        label: "Campaign Instances",
        required: false,
    },
];

export default async function Campaigns() {
    const campaigns = await db.campaign.findMany({
        include: {
            world: true,
            characters: true,
            acts: true,
            campaignInstances: true,
        },
    });

    return (
        <GenericCardDisplay
            data={campaigns}
            dataType='campaign'
            inputFields={inputFields}
        />
    );
}
