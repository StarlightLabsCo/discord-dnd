import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Adventures() {
    const adventures = await db.adventure.findMany({
        include: {
            act: true,
            beats: true,
        },
    });

    return <DataCardDisplay data={adventures} dataType='adventure' />;
}
