import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Beats() {
    const beats = await db.beat.findMany({
        include: {
            adventure: true,
        },
    });

    return <DataCardDisplay data={beats} dataType='beat' />;
}
