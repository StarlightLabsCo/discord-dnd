import { Message } from "database";
import { useGameStore } from "@/lib/game";
import { cn } from "@/lib/tailwind/utils";
import { s3UrlRewriter } from "@/lib/discord/utils";
import { StreamedMessage } from "./StreamedMessage";
import { NonStreamedMessage } from "./NonStreamedMessage";

type MessageDisplayProps = {
    message: Message;
    streamed: boolean;
    className?: string;
};

export function MessageDisplay({
    message,
    streamed,
    className,
}: MessageDisplayProps) {
    const character =
        useGameStore().gameState?.selectedCampaignInstance.characterInstances.find(
            (ci) => ci.id === message.characterInstanceId
        );

    return (
        <div className={cn("flex gap-x-[1.5vw]", className)}>
            <div className='shrink-0'>
                <img
                    src={
                        character
                            ? s3UrlRewriter(character.imageUrl)
                            : "/r2/dm.webp"
                    }
                    className='rounded-full w-[3vw] h-[3vw] object-cover'
                />
            </div>
            <div className='text-white font-light text-[1.1vw] flex flex-col gap-y-[2vh] max-w-full'>
                {streamed ? (
                    <StreamedMessage text={message.content} />
                ) : (
                    <NonStreamedMessage text={message.content} />
                )}
            </div>
        </div>
    );
}
