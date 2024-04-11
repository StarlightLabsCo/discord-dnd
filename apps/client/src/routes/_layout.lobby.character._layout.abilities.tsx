import { createFileRoute } from "@tanstack/react-router";
import { useCharacterStore } from "@/lib/game/character";
import { AbilityScoreSelector } from "@/components/lobby/character/AbilityScoreSelector";

export const Route = createFileRoute(
    "/_layout/lobby/character/_layout/abilities"
)({
    component: Abilities,
});

function Abilities() {
    const {
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,

        setStrength,
        setDexterity,
        setConstitution,
        setIntelligence,
        setWisdom,
        setCharisma,

        characterAbilityPoints,
        setCharacterAbilityPoints,
    } = useCharacterStore();

    const resetAbilities = () => {
        setStrength(8);
        setDexterity(8);
        setConstitution(8);
        setIntelligence(8);
        setWisdom(8);
        setCharisma(8);
        setCharacterAbilityPoints(27);
    };

    const resetDisabled = characterAbilityPoints === 27;

    return (
        <div className='flex flex-col items-center w-[80%] gap-y-[2.5vw]'>
            <div className='flex flex-col text-[1vw] items-center'>
                <div>Ability Points</div>
                <div
                    className={`${characterAbilityPoints > 0 ? "text-red-500" : ""}`}
                >
                    {characterAbilityPoints} / 27
                </div>
            </div>
            <AbilityScoreSelector
                key={"strength"}
                id={"strength"}
                title={"Strength"}
                value={strength}
            />
            <AbilityScoreSelector
                key={"dexterity"}
                id={"dexterity"}
                title={"Dexterity"}
                value={dexterity}
            />
            <AbilityScoreSelector
                key={"constitution"}
                id={"constitution"}
                title={"Constitution"}
                value={constitution}
            />
            <AbilityScoreSelector
                key={"intelligence"}
                id={"intelligence"}
                title={"Intelligence"}
                value={intelligence}
            />
            <AbilityScoreSelector
                key={"wisdom"}
                id={"wisdom"}
                title={"Wisdom"}
                value={wisdom}
            />
            <AbilityScoreSelector
                key={"charisma"}
                id={"charisma"}
                title={"Charisma"}
                value={charisma}
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
