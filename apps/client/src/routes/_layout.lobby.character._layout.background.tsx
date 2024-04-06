import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/lobby/character/_layout/background")({
    component: Background,
});

function Background() {
    return <>Background</>;
}
