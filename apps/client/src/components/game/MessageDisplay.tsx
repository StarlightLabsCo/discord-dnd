import { useGameStore } from "@/lib/game";
import { cn } from "@/lib/tailwind/utils";
import { Message } from "database";

type Props = {
    message: Message;
    className?: string;
};

export function MessageDisplay({ message, className }: Props) {
    const character =
        useGameStore().state?.selectedCampaign.characterInstances.find(
            (ci) => ci.id === message.characterInstanceId
        );

    if (!character) {
        console.error("Character not found for message", message);
        return null;
    }

    return (
        <div className={cn("flex gap-x-6", className)}>
            <div className='shrink-0'>
                <img
                    src={character.imageUrl}
                    className='rounded-full w-[3vw] h-[3vw]'
                />
            </div>
            <div className='text-white'>{message.content}</div>
        </div>
    );
}
