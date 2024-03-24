import { handleTokenRequest } from "./src/token";

const server = Bun.serve({
    async fetch(req: Request) {
        try {
            const url = new URL(req.url);

            if (url.pathname === "/api/token") return handleTokenRequest(req);
            else return new Response("Not Found", { status: 404 });
        } catch (e) {
            console.error(e);
            return new Response("Internal Server Error", { status: 500 });
        }
    },
});

console.log(`Backend server running at ${server.url}`);
