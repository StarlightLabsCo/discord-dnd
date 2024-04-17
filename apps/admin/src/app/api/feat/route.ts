import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
    const feats = await db.feat.findMany();

    return new Response(JSON.stringify(feats), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (
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
