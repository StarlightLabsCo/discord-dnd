import { Message } from "database";
import { cn } from "@/lib/tailwind/utils";

type DMToolCallResultMessageProps = {
    message: Message;
    className?: string;
};

export function DMToolCallResultMessage({
    message,
    className,
}: DMToolCallResultMessageProps) {
    const parsedMessage = JSON.parse(message.content);
    const content = parsedMessage.content;

    return (
        <div className={cn("flex gap-x-[1.5vw]", className)}>
            <div className='shrink-0 w-[3vw]' />
            <div
                className={cn(
                    "text-[#A5A5A5] font-light text-[0.8vw]",
                    className
                )}
            >
                {content}
            </div>
        </div>
    );
}
