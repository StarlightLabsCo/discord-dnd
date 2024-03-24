export async function handleTokenRequest(req: Request) {
    if (!process.env.VITE_DISCORD_CLIENT_ID) {
        console.error("VITE_DISCORD_CLIENT_ID is required");
        return new Response("Internal Server Error", { status: 500 });
    }

    if (!process.env.DISCORD_CLIENT_SECRET) {
        console.error("DISCORD_CLIENT_SECRET is required");
        return new Response("Internal Server Error", { status: 500 });
    }

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

    const { access_token } = (await response.json()) as {
        access_token: string;
    };

    return new Response(JSON.stringify({ access_token }), {
        headers: { "Content-Type": "application/json" },
    });
}
