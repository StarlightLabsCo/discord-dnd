import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Classfeatures() {
    const classFeatures = await db.classFeature.findMany({
        include: {
            class: true,
        },
    });

    return <DataCardDisplay data={classFeatures} dataType='classFeature' />;
}
