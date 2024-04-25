import { createFileRoute } from "@tanstack/react-router";
import { useCharacterEditorStore } from "@/lib/game/characterEditor";
import {
    SelectableGrid,
    SelectableGridItem,
} from "@/components/lobby/character/SelectableGrid";

export const Route = createFileRoute("/lobby/character/background")({
    component: Background,
});

function Background() {
    const { world, draftCharacter, setDraftCharacter } =
        useCharacterEditorStore();
    if (!world || !draftCharacter) {
        return <div>World or Draft Character is undefined.</div>;
    }

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
