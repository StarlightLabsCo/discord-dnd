import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.S3_ACCESS_KEY_ID) {
    throw new Error("Missing S3_ACCESS_KEY_ID");
}

if (!process.env.S3_SECRET_ACCESS_KEY) {
    throw new Error("Missing S3_SECRET_ACCESS_KEY");
}

if (!process.env.S3_ENDPOINT) {
    throw new Error("Missing S3_ENDPOINT");
}

if (!process.env.S3_ASSETS_BUCKET) {
    throw new Error("Missing S3_ASSETS_BUCKET");
}

if (!process.env.S3_PUBLIC_URL) {
    throw new Error("Missing S3_PUBLIC_URL");
}

const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: false,
});

export async function POST(req: NextRequest) {
    const body = await req.json();
    if (!body || !body.file || !body.contentType) {
        return new Response(
            JSON.stringify({
                error: "Missing file or contentType in request body",
            }),
            { status: 400 }
        );
    }

    try {
        const imageBuffer = Buffer.from(body.file, "base64");
        const contentType = body.contentType;
        const extension = contentType.split("/")[1];
        const key = createId() + "." + extension;

        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.S3_ASSETS_BUCKET,
            Key: key,
            Body: imageBuffer,
            ContentType: contentType,
        });

        await s3.send(uploadCommand);

        const imageUrl = `https://${process.env.S3_PUBLIC_URL}/${key}`;
        return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: (error as Error).message || "An error occurred",
            }),
            { status: 500 }
        );
    }
}
