import { DiscordSDK } from "@discord/embedded-app-sdk";
import { authenticate } from "./auth";
import { useDiscordStore } from "../stores/discord-store";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

const instanceId = discordSdk.instanceId;
useDiscordStore.getState().setInstanceId(instanceId);

async function setup() {
    await discordSdk.ready();

    const auth = await authenticate();
    useDiscordStore.getState().setAuth(auth);
}

export { setup, discordSdk as default };
