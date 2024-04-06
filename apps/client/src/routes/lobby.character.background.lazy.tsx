import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/lobby/character/background")({
    component: Background,
});

function Background() {
    return <>Background</>;
}
