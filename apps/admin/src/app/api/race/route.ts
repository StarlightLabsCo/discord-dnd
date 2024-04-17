import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
    const races = await db.race.findMany();

    return new Response(JSON.stringify(races), {
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
        !body.strengthModifier ||
        !body.dexterityModifier ||
        !body.constitutionModifier ||
        !body.intelligenceModifier ||
        !body.wisdomModifier ||
        !body.charismaModifier ||
        !body.size ||
        !body.speed
    ) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const race = await db.race.create({
        data: {
            world: {
                connect: {
                    id: body.worldId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
            strengthModifier: body.strengthModifier,
            dexterityModifier: body.dexterityModifier,
            constitutionModifier: body.constitutionModifier,
            intelligenceModifier: body.intelligenceModifier,
            wisdomModifier: body.wisdomModifier,
            charismaModifier: body.charismaModifier,
            size: body.size,
            speed: body.speed,
        },
    });

    return new Response(JSON.stringify(race), {
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

    await db.race.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
