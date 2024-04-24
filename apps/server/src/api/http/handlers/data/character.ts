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

    const baseData = {
        ...characterData,

        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        userId: undefined,
        characterId: undefined,
        campaignInstanceId: undefined,
        raceId: undefined,
        subraceId: undefined,
        classId: undefined,
        backgroundId: undefined,
        currentLocationId: undefined,

        user: characterData.userId
            ? { connect: { id: characterData.userId } }
            : undefined,
        campaignInstance: {
            connect: { id: characterData.campaignInstanceId },
        },
        race: { connect: { id: characterData.raceId } },
        subrace: characterData.subraceId
            ? { connect: { id: characterData.subraceId } }
            : undefined,
        class: { connect: { id: characterData.classId } },
        background: { connect: { id: characterData.backgroundId } },
        currentLocation: characterData.currentLocationId
            ? { connect: { id: characterData.currentLocationId } }
            : undefined,
    };

    if (existingCharacter) {
        const updatedCharacterInstance = await db.characterInstance.update({
            where: { id: characterData.id },
            data: baseData,
        });
        return new Response(JSON.stringify(updatedCharacterInstance), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } else {
        const newCharacterInstance = await db.characterInstance.create({
            data: baseData,
        });
        return new Response(JSON.stringify(newCharacterInstance), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    }
}
