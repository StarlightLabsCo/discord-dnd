import { createFileRoute } from "@tanstack/react-router";

import {
    SelectableGrid,
    SelectableGridItem,
} from "@/components/lobby/character/SelectableGrid";
import { useCharacterEditorStore } from "@/lib/game/characterEditor";
import { useGameStore } from "@/lib/game";

export const Route = createFileRoute("/lobby/character/race")({
    component: Race,
});
function Race() {
    const { gameState } = useGameStore();
    const { draftCharacter, setDraftCharacter } = useCharacterEditorStore();

    if (!gameState) {
        return <div>Game state is undefined.</div>;
    }

    if (!draftCharacter) {
        return <div>Draft character is undefined</div>;
    }

    const world = gameState.selectedCampaignInstance.campaign.world;

    const items = Object.values(world.races).map((race) => ({
        id: race.id,
        src: race.imageUrl,
        title: race.name,
    }));

    return (
        <SelectableGrid
            items={items as SelectableGridItem[]}
            selected={draftCharacter.raceId}
            setSelected={(id) => {
                setDraftCharacter({
                    ...draftCharacter,
                    raceId: id,
                    race: world.races.find((race) => race.id == id)!,
                });
            }}
            columns={3}
        />
    );
}
