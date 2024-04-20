import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Classes() {
    const classes = await db.class.findMany({
        include: {
            classFeatures: true,
        },
    });

    return <DataCardDisplay data={classes} dataType='class' />;
}
