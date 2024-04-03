import character1 from "@/assets/images/fullbody/character1.webp";
import { CharacterStat } from "./CharacterStat";
import { cn } from "@/lib/utils";

type CharacterPreviewProps = {
    className?: string;
};

export function CharacterPreview({ className }: CharacterPreviewProps) {
    return (
        <div className={cn(`relative h-full w-[30vw]`, className)}>
            <img className='object-cover w-full h-full' src={character1} />
            <div className='flex absolute right-0 bottom-0 left-0 flex-col gap-y-6 items-center pt-2 h-1/3 text-white bg-black bg-opacity-50 border-t border-white'>
                <div className='flex flex-col gap-y-1 items-center'>
                    <h2 className='text-2xl font-bold'>George</h2>
                    <p className='text-sm'>Half-Elf / Half-Human</p>
                    <p className='mb-2 text-sm font-light text-[#A5A5A5]'>
                        Level 1 Wizard
                    </p>
                </div>
                <div className='flex gap-x-6'>
                    <CharacterStat label='STR' value='7' />
                    <CharacterStat label='DEX' value='9' />
                    <CharacterStat label='CON' value='11' />
                    <CharacterStat label='INT' value='17' main />
                    <CharacterStat label='WIS' value='12' />
                    <CharacterStat label='CHA' value='14' />
                </div>
            </div>
        </div>
    );
}
