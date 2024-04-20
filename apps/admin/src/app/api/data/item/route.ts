import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const worldId = url.searchParams.get("worldId");

    const items = await db.item.findMany({
        where: worldId ? { worldId } : {},
        include: {
            backgrounds: true,
            characters: true,
        },
    });

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
            weight: parseInt(body.weight),
            value: parseInt(body.value),
            rarity: body.rarity,
            damageDice: body.damageDice,
            damageType: body.damageType,
            damageBonus: body.damageBonus ? parseInt(body.damageBonus) : null,
            properties: body.properties,
        },
    });

    return new Response(JSON.stringify(item), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing item ID", {
            status: 400,
        });
    }

    // Convert necessary fields to integers
    if (updates.weight) updates.weight = parseInt(updates.weight);
    if (updates.value) updates.value = parseInt(updates.value);
    if (updates.damageBonus)
        updates.damageBonus = parseInt(updates.damageBonus);

    const updated = await db.item.update({
        where: { id },
        data: updates,
    });

    return new Response(JSON.stringify(updated), {
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
