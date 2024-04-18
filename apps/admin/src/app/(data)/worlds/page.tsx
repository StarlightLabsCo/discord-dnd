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
        type: "imageUrl",
        name: "imageUrl",
        label: "Image URL",
        required: true,
    },
    {
        type: "foreignkeyarray",
        dataType: "race",
        name: "races",
        label: "Races",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "class",
        name: "classes",
        label: "Classes",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "background",
        name: "backgrounds",
        label: "Backgrounds",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "feat",
        name: "feats",
        label: "Feats",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "language",
        name: "languages",
        label: "Languages",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "location",
        name: "locations",
        label: "Locations",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "item",
        name: "items",
        label: "Items",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "spell",
        name: "spells",
        label: "Spells",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "campaign",
        name: "campaigns",
        label: "Campaigns",
        required: false,
    },
];

export default async function Worlds() {
    const worlds = await db.world.findMany({
        include: {
            races: true,
            classes: true,
            backgrounds: true,
            feats: true,
            languages: true,
            locations: true,
            items: true,
            spells: true,
            campaigns: true,
        },
    });

    return (
        <GenericCardDisplay
            data={worlds}
            dataType='world'
            inputFields={inputFields}
        />
    );
}
