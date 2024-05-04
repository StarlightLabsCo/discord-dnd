import { cn } from "@/lib/tailwind/utils";
import { useCharacterEditorStore } from "@/lib/game/characterEditor";
import { AbilityScoreDisplay } from "./AbilityScoreDisplay";
import { ItemPreview } from "./ItemPreview";
import { ProficiencyPreview } from "../../ProficiencyPreview";
import { s3UrlRewriter } from "@/lib/discord/utils";
import { Proficiency } from "database";

type CharacterPreviewProps = {
    className?: string;
};

export function CharacterPreview({ className }: CharacterPreviewProps) {
    const { draftCharacter } = useCharacterEditorStore();

    if (!draftCharacter) {
        return <div>Draft character is undefined.</div>;
    }

    return (
        <div className={cn("relative h-full w-[30vw]", className)}>
            <img
                className='object-cover w-full h-full'
                src={s3UrlRewriter(draftCharacter.imageUrl)}
                alt='Character Preview'
            />
            <div className='flex absolute right-0 bottom-0 left-0 flex-col gap-y-[1.5vw] items-center pt-[0.2vw] h-1/3 text-white bg-black bg-opacity-65 border-t border-white'>
                <div className='flex flex-col gap-y-[0.2vw] items-center'>
                    <h2 className='text-[1.5vw] font-bold'>
                        {draftCharacter.name}
                    </h2>
                    <p className='text-[0.9vw]'>{draftCharacter.race.name}</p>
                    <p className='text-[0.9vw] font-light text-[#A5A5A5]'>
                        Level 1 {draftCharacter.class.name}
                    </p>
                </div>
                <div className='flex gap-x-[1.5vw]'>
                    <AbilityScoreDisplay
                        key='strength'
                        label='STR'
                        value={draftCharacter.strength}
                        main={"strength" === draftCharacter.class.mainAbility}
                    />
                    <AbilityScoreDisplay
                        key='dexterity'
                        label='DEX'
                        value={draftCharacter.dexterity}
                        main={"dexterity" === draftCharacter.class.mainAbility}
                    />
                    <AbilityScoreDisplay
                        key='constitution'
                        label='CON'
                        value={draftCharacter.constitution}
                        main={
                            "constitution" === draftCharacter.class.mainAbility
                        }
                    />
                    <AbilityScoreDisplay
                        key='intelligence'
                        label='INT'
                        value={draftCharacter.intelligence}
                        main={
                            "intelligence" === draftCharacter.class.mainAbility
                        }
                    />
                    <AbilityScoreDisplay
                        key='wisdom'
                        label='WIS'
                        value={draftCharacter.wisdom}
                        main={"wisdom" === draftCharacter.class.mainAbility}
                    />
                    <AbilityScoreDisplay
                        key='charisma'
                        label='CHA'
                        value={draftCharacter.charisma}
                        main={"charisma" === draftCharacter.class.mainAbility}
                    />
                </div>
                <div className='flex gap-x-[3vw] w-full justify-center'>
                    <div className='flex flex-col items-center gap-y-[0.5vw]'>
                        <div className='text-[0.8vw] text-neutral-400'>
                            Starting Skills
                        </div>
                        <div className='flex gap-x-[1.5vw]'>
                            {draftCharacter.background.proficiencies.map(
                                (skill: Proficiency) => {
                                    return (
                                        <ProficiencyPreview
                                            key={skill.id}
                                            proficiency={skill}
                                            className='h-[3vw] w-[3vw]'
                                        />
                                    );
                                }
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-y-[0.5vw]'>
                        <div className='text-[0.8vw] text-neutral-400'>
                            Starting Items
                        </div>
                        <div className='flex gap-x-[1.5vw]'>
                            {draftCharacter.background.startingEquipment.map(
                                (item) => (
                                    <ItemPreview
                                        key={item.id}
                                        item={item}
                                        className=' h-[3vw] w-[3vw]'
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
