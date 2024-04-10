import { defineConfig } from "vite";

import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        TanStackRouterVite({
            experimental: {
                enableCodeSplitting: true,
            },
        }),
        react(),
    ],
});
