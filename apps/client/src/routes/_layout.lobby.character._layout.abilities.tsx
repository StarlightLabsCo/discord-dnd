import { createFileRoute } from "@tanstack/react-router";
import { useCharacterContext } from "@/components/lobby/character/CharacterContext";
import { AbilityScoreSelector } from "@/components/lobby/character/AbilityScoreSelector";

export const Route = createFileRoute(
    "/_layout/lobby/character/_layout/abilities"
)({
    component: Abilities,
});

function Abilities() {
    const {
        characterAbilities,
        setCharacterAbilities,
        characterAbilityPoints,
        setCharacterAbilityPoints,
    } = useCharacterContext();

    const resetAbilities = () => {
        const resetAbilities = Object.keys(characterAbilities).reduce(
            (acc: { [key: string]: number }, key) => {
                acc[key] = 8;
                return acc;
            },
            {} as { [key: string]: number }
        );
        setCharacterAbilities(resetAbilities);
        setCharacterAbilityPoints(27);
    };

    const resetDisabled = characterAbilityPoints === 27;

    return (
        <div className='flex flex-col items-center w-[80%] gap-y-6'>
            {27 - characterAbilityPoints} / 27
            {Object.entries(characterAbilities).map(([id, value]) => (
                <AbilityScoreSelector key={id} id={id} value={value} />
            ))}
            <button
                onClick={resetAbilities}
                className={`px-4 py-2 mt-4 rounded border ${resetDisabled ? "text-neutral-400 border-neutral-400" : "text-white border-white hover:scale-105"}`}
                disabled={resetDisabled}
            >
                Reset Abilities
            </button>
        </div>
    );
}
