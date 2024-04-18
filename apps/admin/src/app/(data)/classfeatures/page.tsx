import db from "@/lib/db";
import { GenericCardDisplay } from "@/components/GenericCardDisplay";
import { InputField } from "@/components/InputFieldMapper";

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
        <GenericCardDisplay
            data={classFeatures}
            dataType='classFeature'
            inputFields={inputFields}
        />
    );
}
