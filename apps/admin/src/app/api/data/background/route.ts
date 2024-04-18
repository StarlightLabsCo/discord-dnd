import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const worldId = url.searchParams.get("worldId");

    const backgrounds = await db.background.findMany({
        where: worldId ? { worldId } : {},
        include: {
            proficiencies: true,
            equipment: true,
            characters: true,
        },
    });

    return new Response(JSON.stringify(backgrounds), {
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
        !body.personalityTraits ||
        !body.ideals ||
        !body.bonds ||
        !body.flaws
    ) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const background = await db.background.create({
        data: {
            world: {
                connect: {
                    id: body.worldId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
            personalityTraits: body.personalityTraits,
            ideals: body.ideals,
            bonds: body.bonds,
            flaws: body.flaws,
        },
    });

    return new Response(JSON.stringify(background), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing background ID", {
            status: 400,
        });
    }

    const updated = await db.background.update({
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

    await db.background.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
