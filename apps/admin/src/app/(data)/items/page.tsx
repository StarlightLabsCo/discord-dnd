import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Items() {
    const items = await db.item.findMany({
        include: {
            world: true,
            backgrounds: true,
            characters: true,
            characterInstances: true,
        },
    });

    return <DataCardDisplay data={items} dataType='item' />;
}
