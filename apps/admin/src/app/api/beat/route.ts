import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
    const beats = await db.beat.findMany();

    return new Response(JSON.stringify(beats), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (
        !body.adventureId ||
        !body.type ||
        !body.name ||
        !body.description ||
        !body.imageUrl
    ) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const beat = await db.beat.create({
        data: {
            adventure: {
                connect: {
                    id: body.adventureId,
                },
            },
            type: body.type,
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
        },
    });

    return new Response(JSON.stringify(beat), {
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

    await db.beat.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
