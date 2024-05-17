import { s3UrlRewriter } from "@/lib/discord/utils";
import { cn } from "@/lib/tailwind/utils";
import { Message } from "database";

const placeholderDMImage = "https://r2.starlightlabs.co/dm.webp";

type DMStaticMessageProps = {
    message: Message;
    className?: string;
};

export function DMStaticMessage({ message, className }: DMStaticMessageProps) {
    const parsedMessage = JSON.parse(message.content);
    const text = parsedMessage.content;
    const content = text
        .split("\n")
        .map((line: string, i: number) => <div key={i}>{line}</div>);

    return (
        <div className={cn("flex gap-x-[1.5vw]", className)}>
            <div className='shrink-0'>
                <img
                    src={s3UrlRewriter(placeholderDMImage)}
                    className='rounded-full w-[3vw] h-[3vw] object-cover'
                />
            </div>
            <div
                className={cn(
                    `font-light text-[1.1vw] flex flex-col gap-y-[2vh] max-w-full`,
                    message.visible
                        ? "text-white"
                        : "text-neutral-500 text-[0.55vw]"
                )}
            >
                {content}
            </div>
        </div>
    );
}
