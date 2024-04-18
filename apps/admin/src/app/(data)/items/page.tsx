import db from "@/lib/db";
import { DamageType, Dice, ItemRarity } from "database";
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
        type: "text",
        name: "imageUrl",
        label: "Image URL",
        required: true,
    },
    {
        type: "number",
        name: "weight",
        label: "Weight",
        required: true,
    },
    {
        type: "number",
        name: "value",
        label: "Value",
        required: true,
    },
    {
        type: "enum",
        enumObject: ItemRarity,
        name: "rarity",
        label: "Rarity",
        required: true,
    },
    {
        type: "enum",
        enumObject: Dice,
        name: "damageDice",
        label: "Damage Dice",
        required: false,
    },
    {
        type: "enum",
        enumObject: DamageType,
        name: "damageType",
        label: "Damage Type",
        required: false,
    },
    {
        type: "number",
        name: "damageBonus",
        label: "Damage Bonus",
        required: false,
    },
    {
        type: "text",
        name: "properties",
        label: "Properties",
        required: true,
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
