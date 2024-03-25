import { db } from "./db";
import type { APIUser } from "discord-api-types/v10";

export async function getUser(access_token: string) {
    const userResponse = await fetch(
        `${process.env.VITE_DISCORD_API_BASE}/users/@me`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );

    const user = (await userResponse.json()) as APIUser;
    if (!user) throw new Error("Invalid user response");

    await db.user.upsert({
        where: { id: user.id },
        create: {
            id: user.id,
            username: user.username,
            global_name: user.global_name,
            avatar: user.avatar,
            locale: user.locale,
        },
        update: {
            username: user.username,
            global_name: user.global_name,
            avatar: user.avatar,
            locale: user.locale,
        },
    });

    return user as APIUser;
}
