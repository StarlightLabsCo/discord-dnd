import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
    const items = await db.item.findMany();

    return new Response(JSON.stringify(items), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (
        !body.worldId ||
        !body.name ||
        !body.description ||
        !body.imageUrl ||
        !body.weight ||
        !body.value ||
        !body.rarity
    ) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const item = await db.item.create({
        data: {
            world: {
                connect: {
                    id: body.worldId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
            weight: body.weight,
            value: body.value,
            rarity: body.rarity,
            damageDice: body.damageDice,
            damageType: body.damageType,
            damageBonus: body.damageBonus,
            properties: body.properties,
        },
    });

    return new Response(JSON.stringify(item), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function DELETE(request: NextRequest) {
    const body = await request.json();

    if (!body.id) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    await db.item.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
