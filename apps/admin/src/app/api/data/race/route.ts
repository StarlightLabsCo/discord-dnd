import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const worldId = url.searchParams.get("worldId");

    const races = await db.race.findMany({
        where: worldId ? { worldId } : {},
        include: {
            languages: true,
            racialTraits: true,
            subraces: true,
            characters: true,
        },
    });

    return new Response(JSON.stringify(races), {
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
        !body.strengthModifier ||
        !body.dexterityModifier ||
        !body.constitutionModifier ||
        !body.intelligenceModifier ||
        !body.wisdomModifier ||
        !body.charismaModifier ||
        !body.size ||
        !body.speed
    ) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const race = await db.race.create({
        data: {
            world: {
                connect: {
                    id: body.worldId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
            strengthModifier: Number.parseInt(body.strengthModifier),
            dexterityModifier: Number.parseInt(body.dexterityModifier),
            constitutionModifier: Number.parseInt(body.constitutionModifier),
            intelligenceModifier: Number.parseInt(body.intelligenceModifier),
            wisdomModifier: Number.parseInt(body.wisdomModifier),
            charismaModifier: Number.parseInt(body.charismaModifier),
            size: body.size,
            speed: Number.parseInt(body.speed),
        },
    });

    return new Response(JSON.stringify(race), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing race ID", {
            status: 400,
        });
    }

    const updated = await db.race.update({
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

    await db.race.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
