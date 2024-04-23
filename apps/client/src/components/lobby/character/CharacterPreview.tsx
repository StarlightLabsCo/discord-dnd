import { races } from "starlight-game-data/races";
import { classes } from "starlight-game-data/classes";

import { cn } from "@/lib/tailwind/utils";
import { useCharacterStore } from "@/lib/game/characterEditor";
import { AbilityScoreDisplay } from "./AbilityScoreDisplay";
import { ItemPreview } from "./ItemPreview";
import { SkillPreview } from "./SkillPreview";

type CharacterPreviewProps = {
    className?: string;
};

export function CharacterPreview({ className }: CharacterPreviewProps) {
    const {
        raceId,
        classId,
        name,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        imageUrl,
    } = useCharacterStore();

    return (
        <div className={cn("relative h-full w-[30vw]", className)}>
            <img
                className='object-cover w-full h-full'
                src={imageUrl}
                alt='Character Preview'
            />
            <div className='flex absolute right-0 bottom-0 left-0 flex-col gap-y-[1.5vw] items-center pt-[0.2vw] h-1/3 text-white bg-black bg-opacity-65 border-t border-white'>
                <div className='flex flex-col gap-y-[0.2vw] items-center'>
                    <h2 className='text-[1.5vw] font-bold'>{name}</h2>
                    <p className='text-[0.9vw]'>{races[raceId].title}</p>
                    <p className='text-[0.9vw] font-light text-[#A5A5A5]'>
                        Level 1 {classes[classId].title}
                    </p>
                </div>
                <div className='flex gap-x-[1.5vw]'>
                    <AbilityScoreDisplay
                        key='strength'
                        label='STR'
                        value={strength}
                        main={"strength" === classes[classId].mainAbility.id}
                    />
                    <AbilityScoreDisplay
                        key='dexterity'
                        label='DEX'
                        value={dexterity}
                        main={"dexterity" === classes[classId].mainAbility.id}
                    />
                    <AbilityScoreDisplay
                        key='constitution'
                        label='CON'
                        value={constitution}
                        main={
                            "constitution" === classes[classId].mainAbility.id
                        }
                    />
                    <AbilityScoreDisplay
                        key='intelligence'
                        label='INT'
                        value={intelligence}
                        main={
                            "intelligence" === classes[classId].mainAbility.id
                        }
                    />
                    <AbilityScoreDisplay
                        key='wisdom'
                        label='WIS'
                        value={wisdom}
                        main={"wisdom" === classes[classId].mainAbility.id}
                    />
                    <AbilityScoreDisplay
                        key='charisma'
                        label='CHA'
                        value={charisma}
                        main={"charisma" === classes[classId].mainAbility.id}
                    />
                </div>
                <div className='flex gap-x-[3vw] w-full justify-center'>
                    <div className='flex flex-col items-center gap-y-[0.5vw]'>
                        <div className='text-[0.8vw] text-neutral-400'>
                            Starting Skills
                        </div>
                        <div className='flex gap-x-[1.5vw]'>
                            {classes[classId].startingSkills?.map((skill) => (
                                <SkillPreview key={skill.id} skill={skill} />
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-y-[0.5vw]'>
                        <div className='text-[0.8vw] text-neutral-400'>
                            Starting Items
                        </div>
                        <div className='flex gap-x-[1.5vw]'>
                            {classes[classId].startingItems?.map((item) => (
                                <ItemPreview key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
