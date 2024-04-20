import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const worldId = url.searchParams.get("worldId");

    const spells = await db.spell.findMany({
        where: worldId ? { worldId } : {},
        include: {
            characters: true,
        },
    });

    return new Response(JSON.stringify(spells), {
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
        !body.level ||
        !body.school ||
        !body.castingTime ||
        !body.range ||
        !body.components ||
        !body.duration
    ) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const spell = await db.spell.create({
        data: {
            world: {
                connect: {
                    id: body.worldId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
            level: Number.parseInt(body.level),
            school: body.school,
            castingTime: body.castingTime,
            range: Number.parseInt(body.range),
            components: body.components,
            duration: body.duration,
            ritual: body.ritual || false, // Optional field with a default value
        },
    });

    return new Response(JSON.stringify(spell), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing spell ID", {
            status: 400,
        });
    }

    const updated = await db.spell.update({
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

    await db.spell.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
