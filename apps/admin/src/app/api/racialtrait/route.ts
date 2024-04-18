import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const raceId = url.searchParams.get("raceId");
    const subraceId = url.searchParams.get("subraceId");

    const racialTraits = await db.racialTrait.findMany({
        where: {
            ...(raceId && { raceId }),
            ...(subraceId && { subraceId }),
        },
    });

    return new Response(JSON.stringify(racialTraits), {
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

    const racialTrait = await db.racialTrait.create({
        data: {
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
        },
    });

    return new Response(JSON.stringify(racialTrait), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing racial trait ID", {
            status: 400,
        });
    }

    const updated = await db.racialTrait.update({
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

    await db.racialTrait.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
