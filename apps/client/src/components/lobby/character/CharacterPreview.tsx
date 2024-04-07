import character1 from "@/assets/images/fullbody/character1.webp";
import { CharacterStat } from "./CharacterStat";
import { cn } from "@/lib/tailwind/utils";
import { abilities } from "@/game/abilities";
import { useCharacterContext } from "./CharacterContext";

type CharacterPreviewProps = {
    className?: string;
};

export function CharacterPreview({ className }: CharacterPreviewProps) {
    const { characterAbilities } = useCharacterContext();

    const highestAbilityKey = Object.keys(characterAbilities).reduce(
        (highest, current) =>
            characterAbilities[highest] > characterAbilities[current]
                ? highest
                : current
    );

    return (
        <div className={cn("relative h-full w-[30vw]", className)}>
            <img
                className='object-cover w-full h-full'
                src={character1}
                alt='Character Preview'
            />
            <div className='flex absolute right-0 bottom-0 left-0 flex-col gap-y-[2vw] items-center pt-[0.5vw] h-1/3 text-white bg-black bg-opacity-65 border-t border-white'>
                <div className='flex flex-col gap-y-[0.2vw] items-center'>
                    <h2 className='text-[1.5vw] font-bold'>George</h2>
                    <p className='text-[0.9vw]'>Half-Elf / Half-Human</p>
                    <p className='mb-[1vw] text-[0.9vw] font-light text-[#A5A5A5]'>
                        Level 1 Wizard
                    </p>
                </div>
                <div className='flex gap-x-[1.5vw]'>
                    {Object.entries(characterAbilities).map(
                        ([ability, value]) => (
                            <CharacterStat
                                key={ability}
                                label={abilities[ability].label}
                                value={value}
                                main={ability === highestAbilityKey}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
