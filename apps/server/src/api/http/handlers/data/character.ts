import { db } from "@/lib/db";
import type { CharacterInstance } from "@prisma/client";

export async function handleCharacterRequest(req: Request) {
    if (req.method === "GET") {
        return GET(req);
    } else if (req.method === "POST") {
        return POST(req);
    }
}

async function GET(request: Request) {
    return new Response(JSON.stringify({}), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

async function POST(request: Request) {
    const characterData = (await request.json()) as CharacterInstance;

    const existingCharacter = await db.characterInstance.findUnique({
        where: { id: characterData.id },
    });

    if (existingCharacter) {
        const updatedCharacter = await db.characterInstance.update({
            where: { id: characterData.id },
            data: {
                ...characterData,
            },
        });
        return new Response(JSON.stringify(updatedCharacter), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } else {
        const newCharacter = await db.characterInstance.create({
            data: {
                ...characterData,
                id: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            },
        });
        return new Response(JSON.stringify(newCharacter), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    }
}
