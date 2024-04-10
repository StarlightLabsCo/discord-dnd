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
    const imagePromptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        max_tokens: 200,
        messages: [
            {
                role: "system",
                content:
                    "Based on a provided character, their stats and other information, please generate a concise detailed image prompt. The image should be in the style of a fantasy Dungeons & Dragons character portrait, with the character looking heroic, ready for adventure and towards the viewer. The style should be digital art. Only output the image prompt, no other information is needed.",
            },
            {
                role: "user",
                content: `Character class: ${classes[classId].title}\nRace: ${races[raceId].title}\nLore: ${JSON.stringify(lore, null, 2)}\nAbility scores: ${JSON.stringify(abilityScores, null, 2)}`,
            },
            {
                role: "assistant",
                content: "Prompt:",
            },
        ],
        openpipe: {
            tags: {
                prompt_id: "character_generation_0.0.0",
            },
        },
    });

    if (
        !imagePromptResponse.choices ||
        !imagePromptResponse.choices[0].message.content
    ) {
        return new Response("Internal Server Error", { status: 500 });
    }

    console.log(imagePromptResponse.choices[0].message.content);

    const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePromptResponse.choices[0].message.content,
        n: 1,
        size: "1024x1792",
        quality: "hd",
    });

    if (!imageResponse) {
        return new Response("Internal Server Error", { status: 500 });
    }

    console.log(imageResponse.data[0].url);

    return new Response();
}
