import { cn } from "@/lib/tailwind/utils";

type SkillPreviewProps = {
    skill: {
        image: string;
        title: string;
        description: string;
    };
    className?: string;
};

export function SkillPreview({ skill, className }: SkillPreviewProps) {
    return (
        <div className={cn("relative group", className)}>
            <img
                className='cursor-pointer h-[3vw] w-[3vw] aspect-square rounded-[0.4vw]'
                src={skill.image}
                alt={skill.title}
            />
            <div className='hidden group-hover:flex items-center absolute inset-0 -translate-x-full rounded-[0.5vw] rounded-br-none -translate-y-full w-[25vw] h-[10vw] bg-black border-[0.1vw] border-white text-white'>
                <img
                    src={skill.image}
                    alt={skill.title}
                    className='h-full aspect-square rounded-l-[0.5vw]'
                />
                <div className='flex flex-col gap-y-[0.5vw] p-[0.5vw]'>
                    <h3 className='text-[1.25vw] font-bold'>{skill.title}</h3>
                    <p className='text-[0.8vw] text-neutral-400'>
                        {skill.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
