import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Racialtraits() {
    const racialTraits = await db.racialTrait.findMany({
        include: {
            proficiencies: true,
        },
    });

    return <DataCardDisplay data={racialTraits} dataType='racialTrait' />;
}
