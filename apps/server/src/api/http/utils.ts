import { ZodSchema } from "zod";
import { getUser } from "@/lib/discord";

export async function authorizeAndValidateRequest<T>(
    req: Request,
    schema: ZodSchema<T>
) {
    let user;

    console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
    const isDevelopment = process.env.NODE_ENV === "development";
    if (isDevelopment) {
        console.log(
            `DEBUG: Development mode, using test user in authorizeAndValidateRequest`
        );
        user = {
            id: "1077378222834073682",
            username: "starlightharris",
            discriminator: "0",
            global_name: "starlight-harris",
        };
    } else {
        const authorization = req.headers.get("Authorization");
        if (!authorization) {
            return { error: new Response("Unauthorized", { status: 401 }) };
        }

        const access_token = authorization.split("Bearer ")[1];
        if (!access_token) {
            return { error: new Response("Unauthorized", { status: 401 }) };
        }

        user = await getUser(access_token);
        if (!user) {
            return { error: new Response("Unauthorized", { status: 401 }) };
        }
    }

    // Parse and validate request body
    const body = await req.json();
    const parsedRequest = schema.safeParse(body);
    if (!parsedRequest.success) {
        return {
            error: new Response(JSON.stringify(parsedRequest.error), {
                status: 400,
            }),
        };
    }

    return { user, data: parsedRequest.data };
}
