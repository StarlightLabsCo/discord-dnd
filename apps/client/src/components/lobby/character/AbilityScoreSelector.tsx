import { abilities } from "@/game/abilities";
import { useCharacterContext } from "@/components/lobby/character/CharacterContext";
import { Icons } from "@/components/Icons";

type AbilityScoreSelectorProps = {
    id: string;
    value: number;
    className?: string;
};

export function AbilityScoreSelector({
    id,
    value,
    className,
}: AbilityScoreSelectorProps) {
    const {
        setCharacterAbilities,
        setCharacterAbilityPoints,
        characterAbilityPoints,
    } = useCharacterContext();

    const abilityCosts: { [key: number]: number } = {
        8: 0,
        9: 1,
        10: 2,
        11: 3,
        12: 4,
        13: 5,
        14: 7,
        15: 9,
    };

    const calculateCost = (newValue: number, oldValue: number) =>
        abilityCosts[newValue] - (abilityCosts[oldValue] || 0);

    const handleChange = (newValue: number) => {
        const costDifference = calculateCost(newValue, value);
        if (characterAbilityPoints >= costDifference) {
            setCharacterAbilities((prev) => ({ ...prev, [id]: newValue }));
            setCharacterAbilityPoints((prev) => prev - costDifference);
        }
    };

    const handleIncrement = () => handleChange(Math.min(value + 1, 15));
    const handleDecrement = () => handleChange(Math.max(value - 1, 8));

    const isIncrementDisabled =
        value === 15 ||
        characterAbilityPoints < calculateCost(value + 1, value);
    const isDecrementDisabled = value === 8;

    const calculateModifier = (score: number) => {
        const modifiers = {
            1: -5,
            3: -4,
            5: -3,
            7: -2,
            9: -1,
            11: 0,
            13: 1,
            15: 2,
            17: 3,
            19: 4,
            21: 5,
            23: 6,
            25: 7,
            27: 8,
            29: 9,
            30: 10,
        };

        for (const [key, value] of Object.entries(modifiers)) {
            if (score <= Number(key)) {
                return value >= 0 ? `+${value}` : value.toString();
            }
        }
        return 0;
    };

    return (
        <div className={`flex items-center ${className}`}>
            <img
                src={""}
                alt={`${abilities[id].title} icon`}
                className='w-6 h-6'
            />
            <span className='w-48 text-xl text-center'>
                {abilities[id].title}
            </span>
            <div className='flex flex-col items-center w-12'>
                <span className='text-center'>{value}</span>
                <span className='text-xs font-light text-center text-neutral-400'>{`(${calculateModifier(value)})`}</span>
            </div>
            <button
                onClick={handleIncrement}
                disabled={isIncrementDisabled}
                className={`p-1 rounded ${isIncrementDisabled ? "text-gray-800" : "text-white hover:scale-125"}`}
            >
                <Icons.plus className='w-6 h-6' />
            </button>
            <button
                onClick={handleDecrement}
                disabled={isDecrementDisabled}
                className={`p-1 ml-2 rounded ${isDecrementDisabled ? "text-gray-800" : "text-white hover:scale-125"}`}
            >
                <Icons.minus className='w-6 h-6' />
            </button>
        </div>
    );
}