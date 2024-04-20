import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Races() {
    const races = await db.race.findMany({
        include: {
            languages: true,
            racialTraits: true,
            subraces: true,
            characters: true,
        },
    });

    return <DataCardDisplay data={races} dataType='race' />;
}
