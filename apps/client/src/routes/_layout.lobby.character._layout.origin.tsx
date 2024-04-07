import { createFileRoute } from "@tanstack/react-router";

import { origins } from "@/game/origins";
import { useCharacterContext } from "@/components/lobby/character/CharacterContext";
import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";

export const Route = createFileRoute("/_layout/lobby/character/_layout/origin")(
    {
        component: Origin,
    }
);

function Origin() {
    const { originId, setOriginId } = useCharacterContext();

    const items = Object.values(origins).map((origin) => ({
        id: origin.id,
        src: origin.src,
        title: origin.title,
        subtitle: "",
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
