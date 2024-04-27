import { MessageDisplay } from "./MessageDisplay";
import { useGameStore } from "@/lib/game";

export function GameChat() {
    // TODO: fetch the state of the game chat and load messages
    // TODO: implement handlers for websocket events (add new message, update existing message, etc)
    const messages = useGameStore().state?.selectedCampaign.messages || [];

    return (
        <div className='grow w-1/2 flex flex-col gap-y-16 pt-10'>
            {messages.map((message) => {
                return <MessageDisplay key={message.id} message={message} />;
            })}
        </div>
    );
}
