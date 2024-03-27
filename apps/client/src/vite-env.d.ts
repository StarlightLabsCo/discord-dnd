/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DISCORD_CLIENT_ID: string;
    readonly VITE_DISCORD_EMBED_DEBUG: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
