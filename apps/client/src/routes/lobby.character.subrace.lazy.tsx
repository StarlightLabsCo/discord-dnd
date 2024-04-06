import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/lobby/character/subrace")({
    component: Subrace,
});

function Subrace() {
    return <>Subrace</>;
}
