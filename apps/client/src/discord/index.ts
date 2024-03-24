import { DiscordSDK } from "@discord/embedded-app-sdk";
import { authenticate } from "./auth";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

async function setup() {
    await discordSdk.ready();
    console.log("Discord SDK ready");

    await authenticate();
    console.log("Authenticated");
}

export { setup, discordSdk as default };
