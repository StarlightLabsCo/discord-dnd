import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";
import { InputField } from "@/components/data/InputFieldMapper";

const inputFields: InputField[] = [
    {
        type: "foreignkey",
        dataType: "class",
        name: "classId",
        label: "Class ID",
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

export default async function Classfeatures() {
    const classFeatures = await db.classFeature.findMany({
        include: {
            class: true,
        },
    });

    return (
        <DataCardDisplay
            data={classFeatures}
            dataType='classFeature'
            inputFields={inputFields}
        />
    );
}
