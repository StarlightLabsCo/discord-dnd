import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
    const worlds = await db.world.findMany({
        include: {
            races: true,
            classes: true,
            backgrounds: true,
            feats: true,
            languages: true,
            locations: true,
            items: true,
            spells: true,
            campaigns: true,
        },
    });

    return new Response(JSON.stringify(worlds), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.name || !body.description || !body.imageUrl) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const world = await db.world.create({
        data: {
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
        },
    });

    return new Response(JSON.stringify(world), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing world ID", {
            status: 400,
        });
    }

    const updated = await db.world.update({
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

    await db.world.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}