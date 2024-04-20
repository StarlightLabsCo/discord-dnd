import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Feats() {
    const feats = await db.feat.findMany({
        include: {
            characters: true,
            characterInstances: true,
        },
    });

    return <DataCardDisplay data={feats} dataType='feat' />;
}
