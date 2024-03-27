import { db } from "@/lib/db";
import type { User } from "database";
import type { APIUser } from "discord-api-types/v10";

/**
 * Syncs the user with the database (creates or updates) and returns the user.
 *
 * @param access_token The access token of the user.
 * @returns The user object from the database.
 */
export async function getUser(access_token: string) {
    const userResponse = await fetch(
        `${process.env.DISCORD_API_BASE}/users/@me`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    );

    const apiUser = (await userResponse.json()) as APIUser;
    if (!apiUser.id) {
        return null;
    }

    const user = await db.user.upsert({
        where: { id: apiUser.id },
        create: {
            id: apiUser.id,
            username: apiUser.username,
            discriminator: apiUser.discriminator,
            global_name: apiUser.global_name,
            avatar: apiUser.avatar,
            avatar_decoration: apiUser.avatar_decoration,
            locale: apiUser.locale,
        },
        update: {
            username: apiUser.username,
            discriminator: apiUser.discriminator,
            global_name: apiUser.global_name,
            avatar: apiUser.avatar,
            avatar_decoration: apiUser.avatar_decoration,
            locale: apiUser.locale,
        },
    });

    return user as User;
}
