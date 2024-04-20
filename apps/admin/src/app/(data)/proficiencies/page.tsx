import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Proficiencies() {
    const proficiencies = await db.proficiency.findMany({
        include: {
            backgrounds: true,
            characters: true,
            characterInstances: true,
        },
    });

    return <DataCardDisplay data={proficiencies} dataType='proficiency' />;
}
