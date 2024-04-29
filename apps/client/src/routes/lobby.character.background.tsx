import { createFileRoute } from "@tanstack/react-router";
import { useCharacterEditorStore } from "@/lib/game/characterEditor";
import {
    SelectableGrid,
    SelectableGridItem,
} from "@/components/lobby/character/SelectableGrid";
import { useGameStore } from "@/lib/game";

export const Route = createFileRoute("/lobby/character/background")({
    component: Background,
});

function Background() {
    const { gameState } = useGameStore();
    const { draftCharacter, setDraftCharacter } = useCharacterEditorStore();

    if (!gameState) {
        return <div>Game state is undefined.</div>;
    }

    if (!draftCharacter) {
        return <div>Draft Character is undefined.</div>;
    }

    const world = gameState.selectedCampaignInstance.campaign.world;

    const items = Object.values(world.backgrounds).map((background) => ({
        id: background.id,
        src: background.imageUrl,
        title: background.name,
    }));

    return (
        <SelectableGrid
            items={items as SelectableGridItem[]}
            selected={draftCharacter.backgroundId}
            setSelected={(id) => {
                setDraftCharacter({
                    ...draftCharacter,
                    backgroundId: id,
                    background: world.backgrounds.find(
                        (background) => background.id == id
                    )!,
                });
            }}
            columns={4}
        />
    );
}
