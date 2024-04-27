import { useState } from "react";
import { CharacterInstance, Message } from "database";
import { MessageDisplay } from "./MessageDisplay";

export function GameChat() {
    // TODO: fetch the state of the game chat and load messages
    // TODO: implement handlers for websocket events (add new message, update existing message, etc)
    const [messages, setMessages] = useState<
        (Message & { characterInstance: CharacterInstance })[]
    >([]);

    return (
        <div className='grow w-1/2 flex flex-col gap-y-16 pt-10'>
            {messages.map((message) => {
                return <MessageDisplay key={message.id} message={message} />;
            })}
        </div>
    );
}
