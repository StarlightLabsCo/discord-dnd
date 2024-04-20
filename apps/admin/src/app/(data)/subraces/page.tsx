import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Subraces() {
    const subraces = await db.subrace.findMany({
        include: {
            parentRace: true,
            racialTraits: true,
            characters: true,
        },
    });

    return <DataCardDisplay data={subraces} dataType='subrace' />;
}
