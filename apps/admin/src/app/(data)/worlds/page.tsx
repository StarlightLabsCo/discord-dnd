import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Worlds() {
    const worlds = await db.world.findMany({
        include: {
            races: true,
            classes: true,
            backgrounds: true,
            feats: true,
            languages: true,
            locations: true,
            items: true,
            spells: true,
            campaigns: true,
        },
    });

    return <DataCardDisplay data={worlds} dataType='world' />;
}
