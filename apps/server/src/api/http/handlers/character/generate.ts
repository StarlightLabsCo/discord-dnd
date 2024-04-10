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

    // --- Example Prompt ---
    // Imagine a character you'd find in a Dungeons and Dragons campaign, depicted in a detailed digital art style. This character is a stoic High Elf Wizard, draped in elegant, arcane-infused robes that shimmer with a faint, ethereal light. Around his waist is a belt with various pouches containing scrolls, potions, and arcane trinkets. In one hand, he holds a gnarled wooden staff, topped with a crystal that pulses with magical energy. His other hand is raised, fingers splayed, as if he's about to cast a spell. The background is a blurred mix of ancient library shelves filled with spellbooks and arcane artifacts. His hair is long, silver, and slightly windswept, and his eyes glow with a knowledge of ancient magic. The portrait is vertical, focusing on capturing the character's imposing presence and the fine details of his attire and magical items, emphasizing his role as a powerful and wise adventurer.

    // Generate character
    const name = lore.name;
    const pronouns = lore.pronouns;
    const age = lore.age;
    const voice = lore.voice;

    const race = races[raceId].title;
    const characterClass = classes[classId].title;

    const backstory = lore.backstory;
    const personality = lore.personality;
    const ideals = lore.ideals;
    const bonds = lore.bonds;
    const flaws = lore.flaws;

    const startingItems = classes[classId].startingItems?.reduce(
        (acc, item) => {
            acc.push(item.title);
            return acc;
        },
        [] as string[]
    );

    const imagePromptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        max_tokens: 200,
        messages: [
            {
                role: "system",
                content:
                    "Generate a detailed image description for a fantasy Dungeons & Dragons character portrait. The character should appear heroic, ready for adventure, and looking towards the viewer. The description should incorporate the character's class, race, lore, and ability scores, emphasizing their unique traits, attire, and magical or physical abilities in a style that brings their personality and backstory to life. The character should be depicted in a vertical portrait format, but with their full body visible, focusing on capturing their presence and the fine details of their appearance and equipment, with a slightly blurred background that captures the character's journey. The adventurer is level 1 and has just started their journey.",
            },
            {
                role: "user",
                content: `Name: ${name}\nPronouns: ${pronouns}\nAge: ${age}\nLevel: 1\nCharacter class: ${characterClass}\nRace: ${race}\nBackstory: ${backstory}\nPersonality: ${personality}\nIdeals: ${ideals}\nBonds: ${bonds}\nFlaws: ${flaws}\nStarting Items: ${startingItems.join(", ")}\nAbility Scores: ${JSON.stringify(abilityScores, null, 2)}`,
            },
            {
                role: "assistant",
                content:
                    "Prompt: Imagine a character you'd find in a Dungeons and Dragons campaign, depicted in a detailed digital art style. This character is",
            },
        ],
        openpipe: {
            tags: {
                prompt_id: "character_generation_0.0.3",
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
