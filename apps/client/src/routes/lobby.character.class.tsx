import { createFileRoute } from "@tanstack/react-router";

import { useCharacterEditorStore } from "@/lib/game/characterEditor";
import {
    SelectableGrid,
    SelectableGridItem,
} from "@/components/lobby/character/SelectableGrid";

export const Route = createFileRoute("/lobby/character/class")({
    component: Class,
});

function Class() {
    const { world, draftCharacter, setDraftCharacter } =
        useCharacterEditorStore();
    if (!world || !draftCharacter) {
        return <div>World or Draft Character is undefined.</div>;
    }

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