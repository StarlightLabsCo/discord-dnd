import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lobby/character/abilities")({
    component: Abilities,
});

function Abilities() {
    return <>Abilities</>;
}
