import { createFileRoute } from "@tanstack/react-router";
import { AbilityScoreSelector } from "@/components/lobby/character/AbilityScoreSelector";
import { useCharacterEditorStore } from "@/lib/game/characterEditor";

export const Route = createFileRoute(
    "/_layout/lobby/character/_layout/abilities"
)({
    component: Abilities,
});

function Abilities() {
    const {
        draftCharacter,
        setDraftCharacter,
        availableCharacterAbilityPoints,
    } = useCharacterEditorStore();

    if (!draftCharacter) {
        return <div>Character is undefined.</div>;
    }

    const resetDisabled = availableCharacterAbilityPoints === 27;

    const resetAbilities = () => {
        setDraftCharacter({
            ...draftCharacter,
            strength: 8,
            dexterity: 8,
            constitution: 8,
            intelligence: 8,
            wisdom: 8,
            charisma: 8,
        });
    };

    return (
        <div className='flex flex-col items-center w-[80%] gap-y-[2.5vw]'>
            <div className='flex flex-col text-[1vw] items-center'>
                <div>Ability Points</div>
                <div
                    className={`${availableCharacterAbilityPoints > 0 ? "text-red-500" : ""}`}
                >
                    {availableCharacterAbilityPoints} / 27
                </div>
            </div>
            <AbilityScoreSelector
                key={"strength"}
                id={"strength"}
                title={"Strength"}
                value={draftCharacter.strength}
            />
            <AbilityScoreSelector
                key={"dexterity"}
                id={"dexterity"}
                title={"Dexterity"}
                value={draftCharacter.dexterity}
            />
            <AbilityScoreSelector
                key={"constitution"}
                id={"constitution"}
                title={"Constitution"}
                value={draftCharacter.constitution}
            />
            <AbilityScoreSelector
                key={"intelligence"}
                id={"intelligence"}
                title={"Intelligence"}
                value={draftCharacter.intelligence}
            />
            <AbilityScoreSelector
                key={"wisdom"}
                id={"wisdom"}
                title={"Wisdom"}
                value={draftCharacter.wisdom}
            />
            <AbilityScoreSelector
                key={"charisma"}
                id={"charisma"}
                title={"Charisma"}
                value={draftCharacter.charisma}
            />
            <button
                onClick={resetAbilities}
                className={`px-[1.25vw] py-[0.5vw] mt-[1vw] rounded border ${resetDisabled ? "text-neutral-400 border-neutral-400" : "text-white border-white hover:scale-105"}`}
                disabled={resetDisabled}
            >
                Reset Abilities
            </button>
        </div>
    );
}
