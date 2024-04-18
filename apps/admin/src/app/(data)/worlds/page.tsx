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
    {
        type: "foreignkeyarray",
        dataType: "race",
        foreignKeyField: "worldId",
        name: "races",
        label: "Races",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "class",
        foreignKeyField: "worldId",
        name: "classes",
        label: "Classes",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "background",
        foreignKeyField: "worldId",
        name: "backgrounds",
        label: "Backgrounds",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "feat",
        foreignKeyField: "worldId",
        name: "feats",
        label: "Feats",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "language",
        foreignKeyField: "worldId",
        name: "languages",
        label: "Languages",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "location",
        foreignKeyField: "worldId",
        name: "locations",
        label: "Locations",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "item",
        foreignKeyField: "worldId",
        name: "items",
        label: "Items",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "spell",
        foreignKeyField: "worldId",
        name: "spells",
        label: "Spells",
        required: false,
    },
    {
        type: "foreignkeyarray",
        dataType: "campaign",
        foreignKeyField: "worldId",
        name: "campaigns",
        label: "Campaigns",
        required: false,
    },
];

export default async function Worlds() {
    const worlds = await db.world.findMany();

    return (
        <GenericCardDisplay
            data={worlds}
            dataType='world'
            inputFields={inputFields}
        />
    );
}
