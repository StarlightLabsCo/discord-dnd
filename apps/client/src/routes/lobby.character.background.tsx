import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lobby/character/background")({
    component: Background,
});

function Background() {
    return <>Background</>;
}
