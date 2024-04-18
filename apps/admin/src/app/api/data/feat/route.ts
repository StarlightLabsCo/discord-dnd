import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const worldId = url.searchParams.get("worldId");

    const feats = await db.feat.findMany({
        where: worldId ? { worldId } : {},
        include: {
            characters: true,
        },
    });

    return new Response(JSON.stringify(feats), {
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
        !body.prerequisites
    ) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const feat = await db.feat.create({
        data: {
            world: {
                connect: {
                    id: body.worldId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
            prerequisites: body.prerequisites,
        },
    });

    return new Response(JSON.stringify(feat), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing feat ID", {
            status: 400,
        });
    }

    const updated = await db.feat.update({
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

    await db.feat.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
