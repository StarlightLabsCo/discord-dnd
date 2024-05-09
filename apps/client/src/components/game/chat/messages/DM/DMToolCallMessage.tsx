import { Message } from "database";
import { cn } from "@/lib/tailwind/utils";
import { useGameStore } from "@/lib/game";

type DMToolCallMessageProps = {
    message: Message;
    className?: string;
};

export function DMToolCallMessage({
    message,
    className,
}: DMToolCallMessageProps) {
    const parsedMessage = JSON.parse(message.content);
    const toolCall = parsedMessage.tool_calls[0];

    const character_instance_id =
        toolCall.function.arguments.character_instance_id;
    const characterInstance =
        useGameStore().gameState?.selectedCampaignInstance.characterInstances.find(
            (characterInstance) =>
                characterInstance.id === character_instance_id
        );

    const args = JSON.parse(toolCall.function.arguments);
    const skill_name = args.skill_name;
    const difficulty = args.difficulty;

    return (
        <div className={cn("flex gap-x-[1.5vw]", className)}>
            <div className='shrink-0 w-[3vw]' />
            <div
                className={cn(
                    "text-[#A5A5A5] font-light text-[0.8vw]",
                    className
                )}
            >
                {`Initiated a DC ${difficulty} ${skill_name} check${characterInstance ? " for " + characterInstance.name : ""}.`}
            </div>
        </div>
    );
}
