import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Languages() {
    const languages = await db.language.findMany({
        include: {
            races: true,
        },
    });

    return <DataCardDisplay data={languages} dataType='language' />;
}
