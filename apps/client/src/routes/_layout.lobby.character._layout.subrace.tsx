import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/lobby/character/_layout/subrace")({
    component: Subrace,
});

function Subrace() {
    return <>Subrace</>;
}
