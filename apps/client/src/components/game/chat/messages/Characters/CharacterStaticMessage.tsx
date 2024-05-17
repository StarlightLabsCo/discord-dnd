import { CharacterInstance, Message } from "database";
import { cn } from "@/lib/tailwind/utils";
import { s3UrlRewriter } from "@/lib/discord/utils";

type CharacterStaticMessageProps = {
    message: Message & {
        characterInstance: CharacterInstance;
    };
    className?: string;
};

export function CharacterStaticMessage({
    message,
    className,
}: CharacterStaticMessageProps) {
    const characterInstance = message.characterInstance;
    const text = message.content;
    const content = text
        .split("\n")
        .map((line, i) => <div key={i}>{line}</div>);

    // TODO: remove debug

    return (
        <div className={cn("flex gap-x-[1.5vw]", className)}>
            <div className='shrink-0'>
                <img
                    src={s3UrlRewriter(characterInstance.imageUrl)}
                    className='rounded-full w-[3vw] h-[3vw] object-cover'
                />
            </div>
            <div className='text-white font-light text-[1.1vw] flex flex-col gap-y-[2vh] max-w-full'>
                {content}
            </div>
        </div>
    );
}
