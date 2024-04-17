import db from "@/lib/db";
import {
    GenericCardDisplay,
    InputField,
} from "@/components/GenericCardDisplay";

const inputFields: InputField[] = [
    {
        name: "classId",
        label: "Class ID",
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
];

export default async function Classfeatures() {
    const classFeatures = await db.classFeature.findMany();

    return (
        <GenericCardDisplay
            data={classFeatures}
            dataType='classFeature'
            inputFields={inputFields}
        />
    );
}
