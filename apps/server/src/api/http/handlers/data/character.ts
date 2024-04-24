import { db } from "@/lib/db";
import type { CharacterInstance } from "@prisma/client";
import { authorizeAndValidateRequest } from "@/api/http/utils";
import { CharacterInstanceSchema } from "database/prisma/generated/zod";

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
    const { error, data, user } = await authorizeAndValidateRequest(
        request,
        CharacterInstanceSchema
    );
    if (error) return error;

    const characterData = data as CharacterInstance;

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

        user: characterData.userId ? { connect: { id: user.id } } : undefined,
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
            include: {
                race: true,
                background: true,
                class: true,
            },
        });
        return new Response(JSON.stringify(updatedCharacterInstance), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } else {
        const newCharacterInstance = await db.characterInstance.create({
            data: baseData,
            include: {
                race: true,
                background: true,
                class: true,
            },
        });
        return new Response(JSON.stringify(newCharacterInstance), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    }
}
