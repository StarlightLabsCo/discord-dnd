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

    const user = (await userResponse.json()) as APIUser;
    if (!user.id) {
        return null;
    }

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

/**
 * Converts an API user to a starlight user (stored in db).
 *
 * @param user The API user.
 * @returns The user.
 */
export function apiUserToUser(user: APIUser) {
    return {
        id: user.id,
        username: user.username,
        global_name: user.global_name,
        avatar: user.avatar,
        locale: user.locale,
    } as User;
}
