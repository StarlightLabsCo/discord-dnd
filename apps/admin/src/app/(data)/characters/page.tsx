import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Characters() {
    const characters = await db.character.findMany();

    return <DataCardDisplay data={characters} dataType='character' />;
}
