import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Spells() {
    const spells = await db.spell.findMany({
        include: {
            characters: true,
            characterInstances: true,
        },
    });

    return <DataCardDisplay data={spells} dataType='spell' />;
}
