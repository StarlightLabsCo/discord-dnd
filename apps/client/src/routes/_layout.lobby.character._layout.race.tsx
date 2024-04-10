import { createFileRoute } from "@tanstack/react-router";

import { races } from "starlight-game-data/races";
import { useCharacterContext } from "@/components/lobby/character/CharacterContext";
import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";

export const Route = createFileRoute("/_layout/lobby/character/_layout/race")({
    component: Race,
});

function Race() {
    const { raceId, setRaceId } = useCharacterContext();

    const items = Object.values(races).map((race) => ({
        id: race.id,
        src: race.baseImage,
        title: race.title,
    }));

    return (
        <SelectableGrid
            items={items}
            selected={raceId}
            setSelected={setRaceId}
            columns={3}
        />
    );
}
