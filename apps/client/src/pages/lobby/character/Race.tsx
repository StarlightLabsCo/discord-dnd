import { SelectableGrid } from "./SelectableGrid";

import { races } from "@/assets/images/portraits/races";
import { useGameStore } from "@/game";

export function Race() {
    const selected = useGameStore((state) => state.character.race);
    const setSelected = (index: number) => {
        useGameStore.setState({
            character: {
                ...useGameStore.getState().character,
                race: index,
            },
        });
    };

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
