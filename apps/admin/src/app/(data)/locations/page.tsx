import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Locations() {
    const locations = await db.location.findMany({
        include: {
            subLocations: true,
            characters: true,
            characterInstances: true,
        },
    });

    return <DataCardDisplay data={locations} dataType='location' />;
}
