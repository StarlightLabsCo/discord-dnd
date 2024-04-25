import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/lobby/character/subrace")({
    component: Subrace,
});

function Subrace() {
    return <>Subrace</>;
}
