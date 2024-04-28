import { useGameStore } from "@/lib/game";
import { cn } from "@/lib/tailwind/utils";
import { Message } from "database";

type Props = {
    message: Message;
    className?: string;
};

export function MessageDisplay({ message, className }: Props) {
    const character =
        useGameStore().gameState?.selectedCampaign.characterInstances.find(
            (ci) => ci.id === message.characterInstanceId
        );

    return (
        <div className={cn("flex gap-x-[1.5vw]", className)}>
            <div className='shrink-0'>
                <img
                    src={character ? character.imageUrl : "/r2/dm.webp"}
                    className='rounded-full w-[3vw] h-[3vw] object-cover'
                />
            </div>
            <div className='text-white font-light text-[1.1vw]'>
                {message.content}
            </div>
        </div>
    );
}
