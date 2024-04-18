import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const actId = url.searchParams.get("actId");

    const adventures = await db.adventure.findMany({
        where: actId ? { actId } : {},
        include: {
            beats: true,
        },
    });

    return new Response(JSON.stringify(adventures), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.actId || !body.name || !body.description || !body.imageUrl) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const adventure = await db.adventure.create({
        data: {
            act: {
                connect: {
                    id: body.actId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
        },
    });

    return new Response(JSON.stringify(adventure), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing adventure ID", {
            status: 400,
        });
    }

    const updated = await db.adventure.update({
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

    await db.adventure.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
