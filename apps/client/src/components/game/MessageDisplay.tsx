import { cn } from "@/lib/tailwind/utils";
import { CharacterInstance, Message } from "database";

type Props = {
    message: Message & {
        characterInstance: CharacterInstance;
    };
    className?: string;
};

export function MessageDisplay({ message, className }: Props) {
    return (
        <div className={cn("flex gap-x-6", className)}>
            <div className='shrink-0'>
                <img
                    src={message.characterInstance.imageUrl}
                    className='rounded-full'
                />
            </div>
            <div className='text-white'>{message.content}</div>
        </div>
    );
}
