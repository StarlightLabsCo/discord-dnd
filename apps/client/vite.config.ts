import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig({
    plugins: [
        TanStackRouterVite({
            experimental: {
                enableCodeSplitting: true,
            },
        }),
        react(),
    ],
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
});
