import { classes } from "starlight-game-data/classes";
import { races } from "starlight-game-data/races";
import { GenerateCharacterRequestZodSchema } from "starlight-api-types/rest";
import { getUser } from "@/lib/discord";
import { openai } from "@/lib/openai";

export async function handleGenerateRequest(req: Request) {
    const authorization = req.headers.get("Authorization");
    if (!authorization) {
        return new Response("Unauthorized", { status: 401 });
    }

    const access_token = authorization.split("Bearer ")[1];
    if (!access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user = await getUser(access_token);
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    if (!body) {
        return new Response("Bad Request", { status: 400 });
    }

    const parsedRequest = GenerateCharacterRequestZodSchema.safeParse(body);
    if (!parsedRequest.success) {
        return new Response(JSON.stringify(parsedRequest.error), {
            status: 400,
        });
    }

    const { classId, raceId, lore, abilityScores } = parsedRequest.data;

    // Generate character
    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
                role: "system",
                content:
                    "Based on a provided character, please generate a detailed image prompt for a character.",
            },
            {
                role: "user",
                content: `Character class: ${classes[classId].title}\nRace: ${races[raceId].title}\nLore: ${JSON.stringify(lore, null, 2)}\nAbility scores: ${JSON.stringify(abilityScores, null, 2)}`,
            },
        ],
        openpipe: {
            tags: {
                prompt_id: "character_generation_0.0.0",
            },
        },
    });

    if (!response.choices) {
        return new Response("Internal Server Error", { status: 500 });
    }

    console.log(response);
    console.log(response.choices[0].message.content);

    return new Response();
}
