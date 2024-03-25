import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";
import { getUser } from "./discord";

export async function handleTokenRequest(req: Request) {
    if (!process.env.VITE_DISCORD_CLIENT_ID) {
        console.error("VITE_DISCORD_CLIENT_ID is required");
        return new Response("Internal Server Error", { status: 500 });
    }

    if (!process.env.DISCORD_CLIENT_SECRET) {
        console.error("DISCORD_CLIENT_SECRET is required");
        return new Response("Internal Server Error", { status: 500 });
    }

    // Get code from request body and exchange it for an access token
    const { code } = (await req.json()) as { code: string };

    if (!code) {
        return new Response("Code is required", { status: 400 });
    }

    const response = await fetch(
        `${process.env.VITE_DISCORD_API_BASE}/oauth2/token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.VITE_DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: "authorization_code",
                code: code,
            }),
        }
    );

    if (!response.ok) {
        return new Response("Failed to exchange code for access token", {
            status: 400,
        });
    }

    const { access_token } =
        (await response.json()) as RESTPostOAuth2AccessTokenResult;

    await getUser(access_token);

    return new Response(JSON.stringify({ access_token }), {
        headers: { "Content-Type": "application/json" },
    });
}
