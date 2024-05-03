import { db } from "@/lib/db";
import type { CharacterInstance } from "@prisma/client";
import { authorizeAndValidateRequest } from "@/api/http/utils";
import { CharacterInstanceSchema } from "database/prisma/generated/zod";

export async function handleCharacterRequest(req: Request) {
    if (req.method === "GET") {
        return GET(req);
    } else if (req.method === "POST") {
        return POST(req);
    } else if (req.method === "OPTIONS") {
        // TODO: wtf is this?
        if (process.env.NODE_ENV === "development") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                },
            });
        }
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
        include: {
            proficiencies: true,
            feats: true,
        },
    });

    const race = await db.race.findUnique({
        where: { id: characterData.raceId },
        include: {
            racialTraits: {
                include: {
                    proficiencies: true,
                },
            },
        },
    });

    const characterClass = await db.class.findUnique({
        where: { id: characterData.classId },
        include: {
            classFeatures: true,
            proficiencies: true,
            startingEquipment: true,
        },
    });

    const background = await db.background.findUnique({
        where: { id: characterData.backgroundId },
        include: {
            proficiencies: true,
            startingEquipment: true,
        },
    });

    const combinedProficiencies = [
        ...(race?.racialTraits.flatMap((trait) => trait.proficiencies) || []),
        ...(characterClass?.proficiencies || []),
        ...(background?.proficiencies || []),
    ].map((prof) => ({ id: prof.id }));

    const combinedInventory = [
        ...(characterClass?.startingEquipment || []),
        ...(background?.startingEquipment || []),
    ].map((item) => ({ id: item.id }));

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

        inventory: {
            connect: combinedInventory,
        },
        proficiencies: {
            connect: combinedProficiencies,
        },
    };

    if (existingCharacter) {
        const updatedCharacterInstance = await db.characterInstance.update({
            where: { id: characterData.id },
            data: baseData,
            include: {
                race: true,
                background: {
                    include: {
                        startingEquipment: true,
                        proficiencies: true,
                    },
                },
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
                background: {
                    include: {
                        startingEquipment: true,
                        proficiencies: true,
                    },
                },
                class: true,
            },
        });
        return new Response(JSON.stringify(newCharacterInstance), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    }
}
