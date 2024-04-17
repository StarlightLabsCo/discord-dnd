import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "worldId",
        label: "World ID",
        type: "dropdown",
    },
    {
        name: "name",
        label: "Name",
        type: "text",
    },
    {
        name: "description",
        label: "Description",
        type: "text",
    },
    {
        name: "imageUrl",
        label: "Image URL",
        type: "text",
    },
    {
        name: "weight",
        label: "Weight",
        type: "number",
    },
    {
        name: "value",
        label: "Value",
        type: "number",
    },
    {
        name: "rarity",
        label: "Rarity",
        type: "text",
    },
    {
        name: "damageDice",
        label: "Damage Dice",
        type: "text",
    },
    {
        name: "damageType",
        label: "Damage Type",
        type: "text",
    },
    {
        name: "damageBonus",
        type: "text",
        label: "Damage Bonus",
    },
    {
        name: "properties",
        label: "Properties",
        type: "text",
    },
];

export default async function Items() {
    const items = await db.item.findMany();

    return (
        <GenericCardDisplay
            data={items}
            dataType='item'
            inputFields={inputFields}
        />
    );
}
