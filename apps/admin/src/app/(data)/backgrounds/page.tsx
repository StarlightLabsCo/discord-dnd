import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Backgrounds() {
    const backgrounds = await db.background.findMany({
        include: {
            world: true,
            proficiencies: true,
            equipment: true,
            characters: true,
        },
    });

    return <DataCardDisplay data={backgrounds} dataType='background' />;
}
