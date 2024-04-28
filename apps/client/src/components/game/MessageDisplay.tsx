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

    return (
        <div className={cn("flex gap-x-6", className)}>
            <div className='shrink-0'>
                <img
                    src={
                        character
                            ? character.imageUrl
                            : "https://cdn.midjourney.com/9fc0b2ca-d4dd-498e-8e4f-0540407f4c1c/0_2.webp"
                    }
                    className='rounded-full w-[3vw] h-[3vw] object-cover'
                />
            </div>
            <div className='text-white'>{message.content}</div>
        </div>
    );
}
