import { createFileRoute } from "@tanstack/react-router";

import { useCharacterContext } from "@/contexts/CharacterContext";
import { SelectableGrid } from "@/components/lobby/character/SelectableGrid";
import { races } from "@/assets/images/portraits/races";

export const Route = createFileRoute("/lobby/character/race")({
    component: Race,
});

function Race() {
    const { race, setRace } = useCharacterContext();

    const items = Object.values(races).map((race) => ({
        src: race.baseImage,
        title: race.title,
        subtitle: "",
    }));

    return (
        <SelectableGrid
            items={items}
            selected={race}
            setSelected={setRace}
            columns={3}
        />
    );
}
