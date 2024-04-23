import db from "@/lib/db";
import { Proficiency } from "database";
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
        include: {
            proficiencies: true,
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
            proficiencies: {
                connect: body.proficiencies
                    ? body.proficiencies.map((proficiency: Proficiency) => ({
                          id: proficiency.id,
                      }))
                    : [],
            },
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
    const { id } = body;

    if (!id) {
        return new Response("Missing racial trait ID", {
            status: 400,
        });
    }

    const updated = await db.racialTrait.update({
        where: { id },
        data: {
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
            proficiencies: {
                set: body.proficiencies
                    ? body.proficiencies.map((proficiency: Proficiency) => ({
                          id: proficiency.id,
                      }))
                    : [],
            },
        },
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
