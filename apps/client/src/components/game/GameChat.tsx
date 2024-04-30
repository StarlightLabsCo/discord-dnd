import { MessageDisplay } from "./MessageDisplay";
import { useGameStore } from "@/lib/game";

export function GameChat() {
    // TODO: fetch the state of the game chat and load messages
    // TODO: implement handlers for websocket events (add new message, update existing message, etc)
    const messages =
        useGameStore().gameState?.selectedCampaignInstance.messages || [];

    return (
        <div className='grow w-3/5 max-w-[60%] flex flex-col gap-y-[5vh] pt-[4vh]'>
            {messages.map((message, index) => {
                const streamed =
                    index === messages.length - 1 &&
                    message.characterInstanceId == null;
                return (
                    <MessageDisplay
                        key={message.id}
                        message={message}
                        streamed={streamed}
                    />
                );
            })}
        </div>
    );
}
