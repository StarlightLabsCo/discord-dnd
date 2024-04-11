import type { Server } from "bun";
import {
    PatchCharacterRequestZodSchema,
    PostCharacterRequestZodSchema,
} from "starlight-api-types/rest";

import { authorizeAndValidateRequest } from "@/api/http/utils";
import { db } from "@/lib/db";

export async function handleCharacterRequest(req: Request, server: Server) {
    const url = new URL(req.url);

    if (url.pathname === "/api/character") {
        if (req.method === "POST") return handleCharacterPost(req);
        if (req.method === "PATCH") return handleCharacterPatch(req);
    }
}

async function handleCharacterPost(req: Request) {
    const { error, user, data } = await authorizeAndValidateRequest(
        req,
        PostCharacterRequestZodSchema
    );
    if (error) return error;

    const character = await db.character.create({
        data: {
            user: { connect: { id: user.id } },
            ...data,
        },
    });

    if (!character) {
        return new Response("Internal Server Error", { status: 500 });
    }

    return new Response(JSON.stringify(character), { status: 200 });
}

async function handleCharacterPatch(req: Request) {
    const { error, user, data } = await authorizeAndValidateRequest(
        req,
        PatchCharacterRequestZodSchema
    );
    if (error) return error;

    const character = await db.character.findUnique({
        where: { id: data.characterId },
    });
    if (!character) {
        return new Response("Character not found", { status: 404 });
    }

    if (character.userId !== user.id) {
        return new Response("Unauthorized", { status: 403 });
    }

    const updatedCharacter = await db.character.update({
        where: { id: data.characterId },
        data: {
            ...data.character,
        },
    });

    if (!updatedCharacter) {
        return new Response("Internal Server Error", { status: 500 });
    }
}
