import { DiscordSDK } from "@discord/embedded-app-sdk";
import { authenticate } from "./auth";
import { useDiscordStore } from "../stores/discord-store";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

async function setup() {
    console.log("[DiscordD&D] Setting up Discord SDK");

    await discordSdk.ready();
    console.log("[DiscordD&D] Discord SDK ready");

    const auth = await authenticate();
    useDiscordStore.getState().setAuth(auth);
    console.log("[DiscordD&D] Authenticated");
}

export { setup, discordSdk as default };
