import { db } from "@/lib/db";

export async function handleWorldRequest(req: Request) {
    if (req.method === "GET") {
        return GET(req);
    }
}

async function GET(request: Request) {
    const url = new URL(request.url);
    const campaignId = url.searchParams.get("campaignId");

    let query = {};
    if (campaignId) {
        query = {
            campaigns: {
                some: {
                    id: campaignId,
                },
            },
        };
    }

    const worlds = await db.world.findMany({
        where: query,
        include: {
            races: true,
            classes: true,
            backgrounds: {
                include: {
                    startingEquipment: true,
                    proficiencies: true,
                },
            },
        },
    });

    return new Response(JSON.stringify(worlds), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
