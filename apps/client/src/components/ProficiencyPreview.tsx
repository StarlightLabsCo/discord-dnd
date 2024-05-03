import { s3UrlRewriter } from "@/lib/discord/utils";
import { cn } from "@/lib/tailwind/utils";
import { Proficiency } from "database";

type ProficiencyPreviewProps = {
    proficiency: Proficiency;
    className?: string;
};

export function ProficiencyPreview({
    proficiency,
    className,
}: ProficiencyPreviewProps) {
    return (
        <div className={cn("relative group", className)}>
            <img
                className='cursor-pointer h-[3vw] w-[3vw] aspect-square rounded-[0.4vw]'
                src={s3UrlRewriter(proficiency.imageUrl)}
                alt={proficiency.name}
            />
            <div className='hidden group-hover:flex items-center absolute inset-0 -translate-x-full rounded-[0.5vw] rounded-br-none -translate-y-full w-[25vw] h-[10vw] bg-black border-[0.1vw] border-white text-white'>
                <img
                    src={s3UrlRewriter(proficiency.imageUrl)}
                    alt={proficiency.name}
                    className='h-full aspect-square rounded-l-[0.5vw]'
                />
                <div className='flex flex-col gap-y-[0.5vw] p-[0.5vw]'>
                    <h3 className='text-[1.25vw] font-bold'>
                        {proficiency.name}
                    </h3>
                    <p className='text-[0.8vw] text-neutral-400'>
                        {proficiency.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
