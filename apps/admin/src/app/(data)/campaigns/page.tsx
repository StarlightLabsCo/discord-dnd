import db from "@/lib/db";
import { DataCardDisplay } from "@/components/data/DataCardDisplay";

export default async function Campaigns() {
    const campaigns = await db.campaign.findMany({
        include: {
            world: true,
            characters: true,
            acts: true,
            campaignInstances: true,
        },
    });

    return <DataCardDisplay data={campaigns} dataType='campaign' />;
}
