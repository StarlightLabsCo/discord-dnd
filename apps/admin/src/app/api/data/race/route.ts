import db from "@/lib/db";
import { Language, Proficiency, RacialTrait, Subrace } from "database";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const worldId = url.searchParams.get("worldId");

    const races = await db.race.findMany({
        where: worldId ? { worldId } : {},
        include: {
            languages: true,
            racialTraits: true,
            subraces: true,
            characters: true,
        },
    });

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
            strengthModifier: Number.parseInt(body.strengthModifier),
            dexterityModifier: Number.parseInt(body.dexterityModifier),
            constitutionModifier: Number.parseInt(body.constitutionModifier),
            intelligenceModifier: Number.parseInt(body.intelligenceModifier),
            wisdomModifier: Number.parseInt(body.wisdomModifier),
            charismaModifier: Number.parseInt(body.charismaModifier),
            size: body.size,
            speed: Number.parseInt(body.speed),
            languages: {
                connect: body.languages
                    ? body.languages.map((language: Language) => ({
                          id: language.id,
                      }))
                    : [],
            },
            racialTraits: {
                connect: body.racialTraits
                    ? body.racialTraits.map((racialTrait: RacialTrait) => ({
                          id: racialTrait.id,
                      }))
                    : [],
            },
            subraces: {
                connect: body.subraces
                    ? body.subraces.map((subrace: Subrace) => ({
                          id: subrace.id,
                      }))
                    : [],
            },
        },
    });

    return new Response(JSON.stringify(race), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, languages, racialTraits, proficiencies, subraces, ...updates } =
        body;

    if (!id) {
        return new Response("Missing race ID", {
            status: 400,
        });
    }

    const updated = await db.race.update({
        where: { id },
        data: {
            ...updates,
            strengthModifier: updates.strengthModifier
                ? Number.parseInt(updates.strengthModifier)
                : undefined,
            dexterityModifier: updates.dexterityModifier
                ? Number.parseInt(updates.dexterityModifier)
                : undefined,
            constitutionModifier: updates.constitutionModifier
                ? Number.parseInt(updates.constitutionModifier)
                : undefined,
            intelligenceModifier: updates.intelligenceModifier
                ? Number.parseInt(updates.intelligenceModifier)
                : undefined,
            wisdomModifier: updates.wisdomModifier
                ? Number.parseInt(updates.wisdomModifier)
                : undefined,
            charismaModifier: updates.charismaModifier
                ? Number.parseInt(updates.charismaModifier)
                : undefined,
            speed: updates.speed ? Number.parseInt(updates.speed) : undefined,
            languages: {
                connect: languages
                    ? languages.map((language: Language) => ({
                          id: language.id,
                      }))
                    : [],
            },
            racialTraits: {
                connect: racialTraits
                    ? racialTraits.map((racialTrait: RacialTrait) => ({
                          id: racialTrait.id,
                      }))
                    : [],
            },
            subraces: {
                connect: subraces
                    ? subraces.map((subrace: Subrace) => ({ id: subrace.id }))
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

    await db.race.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
