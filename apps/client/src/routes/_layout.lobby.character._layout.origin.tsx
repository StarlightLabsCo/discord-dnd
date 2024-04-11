import { createFileRoute } from "@tanstack/react-router";

import { origins } from "starlight-game-data/origins";
import { useCharacterStore } from "@/lib/game/character";
import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";

export const Route = createFileRoute("/_layout/lobby/character/_layout/origin")(
    {
        component: Origin,
    }
);

function Origin() {
    const { originId, setOriginId } = useCharacterStore();

    const items = Object.values(origins).map((origin) => ({
        id: origin.id,
        src: origin.src,
        title: origin.title,
    }));

    return (
        <SelectableGrid
            items={items}
            selected={originId}
            setSelected={setOriginId}
            columns={3}
        />
    );
}
