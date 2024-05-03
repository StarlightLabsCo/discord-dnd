import { Icons } from "@/components/Icons";
import { ProficiencyPreview } from "@/components/ProficiencyPreview";
import { AbilityScoreDisplay } from "@/components/lobby/character/AbilityScoreDisplay";
import { ItemPreview } from "@/components/lobby/character/ItemPreview";
import { s3UrlRewriter } from "@/lib/discord/utils";
import { useGameStore } from "@/lib/game";
import {
    CharacterInstance,
    $Enums,
    User,
    Feat,
    Proficiency,
    Item,
} from "database";

type PlayerMenuProps = {
    characterInstance: CharacterInstance & {
        user: User | null;
        feats: Feat[];
        proficiencies: Proficiency[];
        inventory: Item[];
    };
};

export function PlayerMenu({ characterInstance }: PlayerMenuProps) {
    const { playerMenuDialogOpen, setPlayerMenuDialogOpen, gameState } =
        useGameStore();
    if (!playerMenuDialogOpen) return null;

    const world = gameState?.selectedCampaignInstance?.campaign?.world || null;
    if (!world) return null;

    const characterRace = world.races.find(
        (r) => r.id === characterInstance.raceId
    );
    if (!characterRace) return null;

    const characterClass = world.classes.find(
        (c) => c.id === characterInstance.classId
    );
    if (!characterClass) return null;

    const handleClose = () => {
        setPlayerMenuDialogOpen(false);
    };

    // Mapping from Dice enum to corresponding Icons
    const diceIcons = {
        D4: Icons.diceD4,
        D6: Icons.diceD6,
        D8: Icons.diceD8,
        D10: Icons.diceD10,
        D12: Icons.diceD12,
        D20: Icons.diceD20,
    };

    // Get the correct icon based on characterInstance.hitDieType
    const DiceIcon = diceIcons[$Enums.Dice[characterInstance.hitDieType]];

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-[#01131D] border-[0.1vw] border-white  p-[1vw] rounded-2xl shadow-xl relative w-[45%] h-3/4'>
                <Icons.x
                    className='absolute -top-6 -right-6 text-[#A5A5A5] cursor-pointer w-[1.5vw] h-[1.5vw]'
                    onClick={handleClose}
                />
                <div className='flex flex-col w-full h-full'>
                    {/* Top Character Stats (Name - Level - Gold) */}
                    <div className='flex w-full justify-between items-center'>
                        <div className='text-white text-[0.8vw]'>
                            {characterInstance.name}
                        </div>
                        <div className='text-white text-[0.8vw] flex'>
                            {10}
                            <div className='text-[#A5A5A5]'>g</div>
                        </div>
                        <div className='absolute left-1/2 -translate-x-1/2 flex items-center gap-x-[0.2vw]'>
                            <div className='text-white text-[0.6vw] text-nowrap'>
                                Level {characterInstance.level}
                            </div>
                            <div className='w-[14vw] bg-[#484848] h-[0.6vh] rounded-full'>
                                <div
                                    className='bg-[#FFD700] h-full rounded-full'
                                    style={{
                                        width: `${(80 / 100) * 100}%`,
                                    }}
                                />
                            </div>
                            <div className='text-white text-[0.6vw] '>XP</div>
                        </div>
                    </div>
                    {/* Character Stats & Profile Image & Inventory */}
                    <div className='grid grid-cols-2 grid-rows-[96%_4%] my-[1vw] gap-[1vw] w-full h-full'>
                        {/* Character Stats */}
                        <div className='bg-[#040E16] rounded-xl row-span-1 flex flex-col items-center gap-y-[4.5vh] p-[1vw]'>
                            <div className='flex flex-col gap-y-[1vh] items-center'>
                                <div className='text-white font-medium text-[0.8vw]'>
                                    {characterRace.name}
                                </div>
                                <div className='w-[5vw] h-[5vw] bg-white'></div>
                                <div className='text-white text-[0.7vw]'>
                                    Level {characterInstance.level}{" "}
                                    {characterClass.name}
                                </div>
                            </div>

                            <div className='flex gap-x-[1vw] text-white'>
                                <AbilityScoreDisplay
                                    key='strength'
                                    label='STR'
                                    value={characterInstance.strength}
                                    main={
                                        "strength" ===
                                        characterClass.mainAbility
                                    }
                                />
                                <AbilityScoreDisplay
                                    key='dexterity'
                                    label='DEX'
                                    value={characterInstance.dexterity}
                                    main={
                                        "dexterity" ===
                                        characterClass.mainAbility
                                    }
                                />
                                <AbilityScoreDisplay
                                    key='constitution'
                                    label='CON'
                                    value={characterInstance.constitution}
                                    main={
                                        "constitution" ===
                                        characterClass.mainAbility
                                    }
                                />
                                <AbilityScoreDisplay
                                    key='intelligence'
                                    label='INT'
                                    value={characterInstance.intelligence}
                                    main={
                                        "intelligence" ===
                                        characterClass.mainAbility
                                    }
                                />
                                <AbilityScoreDisplay
                                    key='wisdom'
                                    label='WIS'
                                    value={characterInstance.wisdom}
                                    main={
                                        "wisdom" === characterClass.mainAbility
                                    }
                                />
                                <AbilityScoreDisplay
                                    key='charisma'
                                    label='CHA'
                                    value={characterInstance.charisma}
                                    main={
                                        "charisma" ===
                                        characterClass.mainAbility
                                    }
                                />
                            </div>

                            <div className='flex gap-x-[3.5vw] justify-center text-white'>
                                <div className='flex flex-col items-center gap-y-[1vh]'>
                                    <Icons.personRunningFast className='w-[2.5vw] h-[2.5vw]' />
                                    <div className='flex flex-col items-center'>
                                        <div className='text-white font-black text-[1vw]'>
                                            {characterInstance.speed}
                                        </div>
                                        <div className='text-[#A5A5A5] text-[0.5vw]'>
                                            Speed
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col items-center gap-y-[1vh]'>
                                    <Icons.shield className='w-[2.5vw] h-[2.5vw]' />
                                    <div className='flex flex-col items-center'>
                                        <div className='text-white font-black text-[1vw]'>
                                            {14} {/* TODO: Placeholder */}
                                        </div>
                                        <div className='text-[#A5A5A5] text-[0.5vw]'>
                                            AC
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col items-center gap-y-[1vh]'>
                                    <DiceIcon className='w-[2.5vw] h-[2.5vw]' />
                                    <div className='flex flex-col items-center'>
                                        <div className='text-white font-black text-[1vw]'>
                                            {
                                                $Enums.Dice[
                                                    characterInstance.hitDieType as keyof typeof $Enums.Dice
                                                ]
                                            }
                                        </div>
                                        <div className='text-[#A5A5A5] text-[0.5vw]'>
                                            Hit Dice
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='w-full h-full grid grid-cols-2 gap-x-[0.5vw]'>
                                <div className='flex flex-col w-full h-full items-center text-[0.7vw]'>
                                    <div className='text-white'>
                                        Proficiencies
                                    </div>
                                    <div className='flex flex-col gap-y-[0.5vh]'>
                                        {characterInstance.proficiencies.map(
                                            (proficiency) => (
                                                <ProficiencyPreview
                                                    key={proficiency.id}
                                                    proficiency={proficiency}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className='flex flex-col w-full h-full items-center text-[0.7vw]'>
                                    <div className='text-white'>Features</div>
                                    <div className='flex flex-col gap-y-[0.5vh]'>
                                        {}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Character Image & Inventory */}
                        <div className='rounded-xl row-span-1 flex flex-col'>
                            <img
                                src={s3UrlRewriter(characterInstance.imageUrl)}
                                className='w-full aspect-square object-cover rounded-xl'
                            />
                            <div
                                className='mt-auto rounded-xl grow-0 grid overflow-hidden'
                                style={{
                                    gridTemplateColumns: `repeat(6, 1fr)`,
                                    gridTemplateRows: `repeat(4, 1fr)`,
                                    gap: `0.4vw`,
                                }}
                            >
                                {characterInstance.inventory.map(
                                    (item, index) => (
                                        <ItemPreview
                                            key={item.id}
                                            item={item}
                                        />
                                    )
                                )}
                                {Array.from({
                                    length:
                                        24 - characterInstance.inventory.length,
                                }).map((_, index) => (
                                    <div
                                        key={`empty-${index}`}
                                        className='bg-[#040E16] w-full aspect-square rounded-md'
                                    ></div>
                                ))}
                            </div>
                        </div>
                        {/* Bottom Info Bar */}
                        <div className='col-span-2 row-span-1 grid grid-cols-2 grid-rows-1 gap-x-[1vw]'>
                            <div />
                            <div className='flex items-center gap-[0.5vw] w-full'>
                                <div className='text-white text-[0.7vw]'>
                                    Capacity
                                </div>
                                <div className='w-[10vw] bg-[#464646] h-[0.6vh] rounded-full grow'>
                                    <div
                                        className='bg-white h-full rounded-full'
                                        style={{
                                            width: `${(80 / 100) * 100}%`,
                                        }}
                                    />
                                </div>
                                <div className='text-white text-[0.7vw]'>
                                    {characterInstance.strength * 15} lbs
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
