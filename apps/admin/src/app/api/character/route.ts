import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
    const characters = await db.character.findMany();

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
        !body.personality ||
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
            pronouns: body.pronouns,
            age: body.age,
            voice: body.voice,
            alignment: body.alignment,
            appearance: body.appearance,
            backstory: body.backstory,
            personality: body.personality,
            ideals: body.ideals,
            bonds: body.bonds,
            flaws: body.flaws,
            imageUrl: body.imageUrl,
            level: body.level,
            experience: body.experience,
            proficiencyBonus: body.proficiencyBonus,
            strength: body.strength,
            dexterity: body.dexterity,
            constitution: body.constitution,
            intelligence: body.intelligence,
            wisdom: body.wisdom,
            charisma: body.charisma,
            hitDieCount: body.hitDieCount,
            hitDieType: body.hitDieType,
        },
    });

    return new Response(JSON.stringify(character), {
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
