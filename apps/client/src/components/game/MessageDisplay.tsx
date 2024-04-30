import { Message } from "database";
import { useGameStore } from "@/lib/game";
import { cn } from "@/lib/tailwind/utils";
import { s3UrlRewriter } from "@/lib/discord/utils";
import { useAudioStore } from "@/lib/game/audio";
import { StreamedMessage } from "./StreamedMessage";
import { NonStreamedMessage } from "./NonStreamedMessage";

type MessageDisplayProps = {
    message: Message;
    className?: string;
};

export function MessageDisplay({ message, className }: MessageDisplayProps) {
    const character =
        useGameStore().gameState?.selectedCampaignInstance.characterInstances.find(
            (ci) => ci.id === message.characterInstanceId
        );

    const { streamedMessageId } = useAudioStore();
    const isStreamed = streamedMessageId === message.id;

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
            <div className='text-white font-light text-[1.1vw] flex flex-col gap-y-[2vh]'>
                {isStreamed ? (
                    <StreamedMessage text={message.content} />
                ) : (
                    <NonStreamedMessage text={message.content} />
                )}
            </div>
        </div>
    );
}
