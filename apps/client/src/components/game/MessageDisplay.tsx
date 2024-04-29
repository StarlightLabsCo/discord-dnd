import { useGameStore } from "@/lib/game";
import { cn } from "@/lib/tailwind/utils";
import { Message } from "database";

type FormattedTextProps = {
    text: string;
};

function FormattedText({ text }: FormattedTextProps) {
    const content = text
        .split("\n")
        .map((line, i) => <div key={i}>{line}</div>);

    return <>{content}</>;
}

type MessageDisplayProps = {
    message: Message;
    className?: string;
};

export function MessageDisplay({ message, className }: MessageDisplayProps) {
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
            <div className='text-white font-light text-[1.1vw] flex flex-col gap-y-[2vh]'>
                <FormattedText text={message.content} />
            </div>
        </div>
    );
}
