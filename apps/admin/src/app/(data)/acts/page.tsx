import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Acts() {
    const acts = await db.act.findMany({
        include: {
            adventures: true,
        },
    });

    return <DataCardDisplay data={acts} dataType='act' />;
}
