import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
    const proficiencies = await db.proficiency.findMany();

    return new Response(JSON.stringify(proficiencies), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.type || !body.name || !body.description || !body.imageUrl) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const proficiency = await db.proficiency.create({
        data: {
            type: body.type,
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
        },
    });

    return new Response(JSON.stringify(proficiency), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
