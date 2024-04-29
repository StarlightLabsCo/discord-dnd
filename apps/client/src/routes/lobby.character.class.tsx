import { createFileRoute } from "@tanstack/react-router";

import { useCharacterEditorStore } from "@/lib/game/characterEditor";
import {
    SelectableGrid,
    SelectableGridItem,
} from "@/components/lobby/character/SelectableGrid";
import { useGameStore } from "@/lib/game";

export const Route = createFileRoute("/lobby/character/class")({
    component: Class,
});

function Class() {
    const { gameState } = useGameStore();
    const { draftCharacter, setDraftCharacter } = useCharacterEditorStore();

    if (!gameState) {
        return <div>Game state is undefined.</div>;
    }

    if (!draftCharacter) {
        return <div>Draft Character is undefined.</div>;
    }

    const world = gameState.selectedCampaignInstance.campaign.world;

    const items = Object.values(world.classes).map((characterClass) => ({
        id: characterClass.id,
        src: characterClass.imageUrl,
        title: characterClass.name,
    }));

    return (
        <SelectableGrid
            items={items as SelectableGridItem[]}
            selected={draftCharacter.classId}
            setSelected={(id) => {
                setDraftCharacter({
                    ...draftCharacter,
                    classId: id,
                    class: world.classes.find(
                        (characterClass) => characterClass.id == id
                    )!,
                });
            }}
            columns={4}
        />
    );
}
