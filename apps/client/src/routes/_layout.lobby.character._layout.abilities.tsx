import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/lobby/character/_layout/abilities")({
    component: Abilities,
});

function Abilities() {
    return <>Abilities</>;
}
