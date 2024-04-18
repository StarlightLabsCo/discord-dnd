import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const parentRaceId = url.searchParams.get("parentRaceId");

    const subraces = await db.subrace.findMany({
        where: parentRaceId ? { parentRaceId } : {},
        include: {
            racialTraits: true,
            characters: true,
        },
    });

    return new Response(JSON.stringify(subraces), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (
        !body.parentRaceId ||
        !body.name ||
        !body.description ||
        !body.imageUrl
    ) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const subrace = await db.subrace.create({
        data: {
            parentRace: {
                connect: {
                    id: body.parentRaceId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
            strengthModifier: body.strengthModifier || 0,
            dexterityModifier: body.dexterityModifier || 0,
            constitutionModifier: body.constitutionModifier || 0,
            intelligenceModifier: body.intelligenceModifier || 0,
            wisdomModifier: body.wisdomModifier || 0,
            charismaModifier: body.charismaModifier || 0,
            size: body.size || "MEDIUM",
            speed: body.speed || 25,
        },
    });

    return new Response(JSON.stringify(subrace), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing subrace ID", {
            status: 400,
        });
    }

    const updated = await db.subrace.update({
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

    await db.subrace.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
