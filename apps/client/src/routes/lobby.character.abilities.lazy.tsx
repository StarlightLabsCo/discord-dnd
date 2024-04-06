import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/lobby/character/abilities")({
    component: Abilities,
});

function Abilities() {
    return <>Abilities</>;
}
