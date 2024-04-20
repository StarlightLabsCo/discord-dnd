import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const campaignId = url.searchParams.get("campaignId");
    const raceId = url.searchParams.get("raceId");
    const subraceId = url.searchParams.get("subraceId");
    const backgroundId = url.searchParams.get("backgroundId");
    const currentLocationId = url.searchParams.get("currentLocationId");

    const characters = await db.character.findMany({
        where: {
            ...(campaignId && { campaignId }),
            ...(raceId && { raceId }),
            ...(subraceId && { subraceId }),
            ...(backgroundId && { backgroundId }),
            ...(currentLocationId && { currentLocationId }),
        },
        include: {
            classes: true,
            background: true,
            proficiencies: true,
            feats: true,
            inventory: true,
            spells: true,
        },
    });

    return new Response(JSON.stringify(characters), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (
        !body.campaignId ||
        !body.raceId ||
        !body.backgroundId ||
        !body.name ||
        !body.pronouns ||
        typeof body.age === "undefined" ||
        !body.voice ||
        !body.alignment ||
        !body.appearance ||
        !body.backstory ||
        !body.personalityTraits ||
        !body.ideals ||
        !body.bonds ||
        !body.flaws ||
        !body.imageUrl ||
        !body.level ||
        !body.experience ||
        !body.proficiencyBonus ||
        !body.strength ||
        !body.dexterity ||
        !body.constitution ||
        !body.intelligence ||
        !body.wisdom ||
        !body.charisma ||
        !body.hitDieCount ||
        !body.hitDieType
    ) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const character = await db.character.create({
        data: {
            campaign: {
                connect: {
                    id: body.campaignId,
                },
            },
            race: {
                connect: {
                    id: body.raceId,
                },
            },
            background: {
                connect: {
                    id: body.backgroundId,
                },
            },

            name: body.name,
            description: "Character Template: " + body.name,
            imageUrl: body.imageUrl,

            pronouns: body.pronouns,
            age: body.age,
            voice: body.voice,
            alignment: body.alignment,
            appearance: body.appearance,
            backstory: body.backstory,
            personalityTraits: body.personalityTraits,
            ideals: body.ideals,
            bonds: body.bonds,
            flaws: body.flaws,
            level: body.level,
            experience: Number.parseInt(body.experience),
            proficiencyBonus: Number.parseInt(body.proficiencyBonus),
            strength: Number.parseInt(body.strength),
            dexterity: Number.parseInt(body.dexterity),
            constitution: Number.parseInt(body.constitution),
            intelligence: Number.parseInt(body.intelligence),
            wisdom: Number.parseInt(body.wisdom),
            charisma: Number.parseInt(body.charisma),
            hitDieCount: Number.parseInt(body.hitDieCount),
            hitDieType: body.hitDieType,
        },
    });

    return new Response(JSON.stringify(character), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing character ID", {
            status: 400,
        });
    }

    const updated = await db.character.update({
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

    await db.character.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
