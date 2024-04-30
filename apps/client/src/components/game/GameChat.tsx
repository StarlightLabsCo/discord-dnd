import { MessageDisplay } from "./MessageDisplay";
import { useGameStore } from "@/lib/game";

export function GameChat() {
    const messages =
        useGameStore().gameState?.selectedCampaignInstance.messages || [];
    const streamedMessageId = useGameStore().gameState?.streamedMessageId;

    return (
        <div className='grow w-3/5 max-w-[60%] flex flex-col gap-y-[5vh] pt-[4vh]'>
            {messages.map((message) => {
                return (
                    <MessageDisplay
                        key={message.id}
                        message={message}
                        streamed={message.id === streamedMessageId}
                    />
                );
            })}
        </div>
    );
}
