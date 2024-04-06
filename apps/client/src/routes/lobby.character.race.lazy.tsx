import { useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";
import { races } from "@/assets/images/portraits/races";

export const Route = createLazyFileRoute("/lobby/character/race")({
    component: Race,
});

function Race() {
    const [selected, setSelected] = useState<number>(0); // TODO: change to lobby store

    const items = Object.values(races).map((race) => ({
        src: race.baseImage,
        title: race.title,
        subtitle: "",
    }));

    return (
        <SelectableGrid
            items={items}
            selected={selected}
            setSelected={setSelected}
            columns={3}
        />
    );
}
