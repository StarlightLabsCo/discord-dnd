import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const worldId = url.searchParams.get("worldId");
    const parentId = url.searchParams.get("parentId");

    const locations = await db.location.findMany({
        where: {
            ...(worldId && { worldId }),
            ...(parentId && { parentId }),
        },
        include: {
            subLocations: true,
            characters: true,
        },
    });

    return new Response(JSON.stringify(locations), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.worldId || !body.name || !body.description || !body.imageUrl) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const location = await db.location.create({
        data: {
            world: {
                connect: {
                    id: body.worldId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
        },
    });

    return new Response(JSON.stringify(location), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing location ID", {
            status: 400,
        });
    }

    const updated = await db.location.update({
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

    await db.location.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
