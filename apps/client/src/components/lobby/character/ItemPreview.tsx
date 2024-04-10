import { Item } from "starlight-game-data/items";
import { cn } from "@/lib/tailwind/utils";

type ItemPreviewProps = {
    item: Item;
    className?: string;
};

export function ItemPreview({ item, className }: ItemPreviewProps) {
    return (
        <div className={cn("relative group", className)}>
            <img
                className='cursor-pointer h-[3vw] w-[3vw] aspect-square rounded-[0.4vw]'
                src={item.image}
                alt={item.title}
            />
            <div className='hidden group-hover:flex items-center absolute inset-0 -translate-x-full rounded-[0.5vw] rounded-br-none -translate-y-full w-[25vw] h-[10vw] bg-black border-[0.1vw] border-white text-white'>
                <img
                    src={item.image}
                    alt={item.title}
                    className='h-full aspect-square rounded-l-[0.5vw]'
                />
                <div className='flex flex-col gap-y-[0.5vw] p-[0.5vw]'>
                    <h3 className='text-[1.25vw] font-bold'>{item.title}</h3>
                    <p className='text-[0.8vw] text-neutral-400'>
                        {item.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
