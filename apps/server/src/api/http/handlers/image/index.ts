import {
    PostImageRequestZodSchema,
    type PostImageResponse,
} from "starlight-api-types/rest";

import { openai } from "@/lib/openai";
import { uploadImageToR2 } from "@/lib/cloudflare";
import { authorizeAndValidateRequest } from "@/api/http/utils";
import type { Item } from "database";

export async function handleImageRequest(req: Request) {
    console.log("Handling image request");
    const url = new URL(req.url);

    if (url.pathname === "/api/image/") {
        if (req.method === "POST") {
            return handleImagePost(req);
        }
    }
}

async function handleImagePost(req: Request) {
    console.log("Handling image post");
    const { error, data } = await authorizeAndValidateRequest(
        req,
        PostImageRequestZodSchema
    );
    if (error) return error;

    console.log("Generating image");

    // const startingItems = classes[data.classId].startingItems?.reduce(
    //     (acc: string[], item: Item) => {
    //         acc.push(item.name);
    //         return acc;
    //     },
    //     [] as string[]
    // );

    // Generate image description
    const imagePromptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        max_tokens: 200,
        messages: [
            {
                role: "system",
                content:
                    "Craft a concise image description for a character portrait illustration of a Dungeons & Dragons character in a fantasy setting. Highlight the character's class, race, key traits, and equipment, set against a fitting (and slightly blurred) background. The character is level 1, just embarking on their journey. Start with 'Imagine a character in a detailed digital art style, a...' and include their class, race, and a brief mention of their journey's beginning. Keep the description concise and vivid. The image must not contain any text or logos, focusing solely on the character and their surroundings. Avoid overly plastic or cartoonish styles, aiming for an illustration and immersive fantasy aesthetic.",
            },
            {
                role: "user",
                content: `Name: ${data.name}\nPronouns: ${data.pronouns}\nAge: ${data.age}\nLevel: 1\nClass: ${data.class.name}\nRace: ${data.race.name}\nBackground${data.background.name}Backstory: ${data.backstory}\nTraits: ${data.personalityTraits}, ${data.ideals}, ${data.bonds}, ${data.flaws}\n\nStats:\n- Strength: ${data.strength}\n- Dexterity: ${data.dexterity}\n- Constitution: ${data.constitution}\n- Intelligence: ${data.intelligence}\n- Wisdom: ${data.wisdom}\n- Charisma: ${data.charisma}`,
            },
        ],
        openpipe: {
            tags: {
                prompt_id: "character_generation_0.0.6",
            },
        },
    });

    if (!imagePromptResponse.choices[0].message.content) {
        console.error(imagePromptResponse);
        return new Response("Internal Server Error", { status: 500 });
    }

    // Generate image
    const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePromptResponse.choices[0].message.content,
        n: 1,
        size: "1024x1792",
        quality: "hd",
    });

    if (!imageResponse.data[0].url) {
        console.error(imageResponse);
        return new Response("Internal Server Error", { status: 500 });
    }

    // Upload image to cloudflare r2
    const imageUrl = await uploadImageToR2(imageResponse.data[0].url);

    return new Response(
        JSON.stringify({
            imageUrl,
        } as PostImageResponse),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}
