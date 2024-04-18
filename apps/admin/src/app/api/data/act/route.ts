import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const campaignId = url.searchParams.get("campaignId");

    const acts = await db.act.findMany({
        where: campaignId ? { campaignId } : {},
        include: {
            adventures: true,
        },
    });

    return new Response(JSON.stringify(acts), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.campaignId || !body.name || !body.description || !body.imageUrl) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }

    const act = await db.act.create({
        data: {
            campaign: {
                connect: {
                    id: body.campaignId,
                },
            },
            name: body.name,
            description: body.description,
            imageUrl: body.imageUrl,
        },
    });

    return new Response(JSON.stringify(act), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return new Response("Missing act ID", {
            status: 400,
        });
    }

    const updated = await db.act.update({
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

    await db.act.delete({
        where: {
            id: body.id,
        },
    });

    return new Response(null, {
        status: 204,
    });
}
