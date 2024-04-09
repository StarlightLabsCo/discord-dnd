import character1 from "@/assets/images/fullbody/character1.webp";
import { cn } from "@/lib/tailwind/utils";
import { races } from "@/game/races";
import { classes } from "@/game/classes";
import { abilities } from "@/game/abilities";
import { useCharacterContext } from "./CharacterContext";
import { CharacterStat } from "./CharacterStat";
import { ItemPreview } from "./ItemPreview";
import { SkillPreview } from "./SkillPreview";

type CharacterPreviewProps = {
    className?: string;
};

export function CharacterPreview({ className }: CharacterPreviewProps) {
    const { raceId, archetypeId, characterAbilities } = useCharacterContext();

    return (
        <div className={cn("relative h-full w-[30vw]", className)}>
            <img
                className='object-cover w-full h-full'
                src={character1}
                alt='Character Preview'
            />
            <div className='flex absolute right-0 bottom-0 left-0 flex-col gap-y-[1.8vw] items-center pt-[0.2vw] h-1/3 text-white bg-black bg-opacity-65 border-t border-white'>
                <div className='flex flex-col gap-y-[0.2vw] items-center'>
                    <h2 className='text-[1.5vw] font-bold'>George</h2>
                    <p className='text-[0.9vw]'>{races[raceId].title}</p>
                    <p className='text-[0.9vw] font-light text-[#A5A5A5]'>
                        Level 1 {classes[archetypeId].title}
                    </p>
                </div>
                <div className='flex gap-x-[1.5vw]'>
                    {Object.entries(characterAbilities).map(
                        ([ability, value]) => (
                            <CharacterStat
                                key={ability}
                                label={abilities[ability].label}
                                value={value}
                                main={
                                    ability ===
                                    classes[archetypeId].mainAbility.id
                                }
                            />
                        )
                    )}
                </div>
                <div className='flex gap-x-[3vw] w-full justify-center'>
                    <div className='flex flex-col items-center gap-y-[0.5vw]'>
                        <div className='text-[0.8vw] text-neutral-400'>
                            Starting Skills
                        </div>
                        <div className='flex gap-x-[1.5vw]'>
                            {classes[archetypeId].startingSkills.map(
                                (skill) => (
                                    <SkillPreview
                                        key={skill.id}
                                        skill={skill}
                                    />
                                )
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-y-[0.5vw]'>
                        <div className='text-[0.8vw] text-neutral-400'>
                            Starting Items
                        </div>
                        <div className='flex gap-x-[1.5vw]'>
                            {classes[archetypeId].startingItems.map((item) => (
                                <ItemPreview key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
