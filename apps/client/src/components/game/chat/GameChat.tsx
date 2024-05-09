import { useGameStore } from "@/lib/game";

import { CharacterStreamedMessage } from "./messages/Characters/CharacterStreamedMessage";
import { CharacterStaticMessage } from "./messages/Characters/CharacterStaticMessage";
import { DMStreamedMessage } from "./messages/DM/DMStreamedMessage";
import { DMStaticMessage } from "./messages/DM/DMStaticMessage";
import { DMToolCallMessage } from "./messages/DM/DMToolCallMessage";
import { DMToolCallResultMessage } from "./messages/DM/DMToolCallResultMessage";

export function GameChat() {
    const messages =
        useGameStore().gameState?.selectedCampaignInstance.messages || [];
    const streamedMessageId = useGameStore().gameState?.streamedMessageId;

    return (
        <div className='grow w-3/5 max-w-[60%] flex flex-col gap-y-[2vh] pt-[4vh]'>
            {messages.map((message) => {
                if (message.characterInstance) {
                    const messageWithCharacterInstance = {
                        ...message,
                        characterInstance: message.characterInstance,
                    };

                    if (message.id === streamedMessageId) {
                        return (
                            <CharacterStreamedMessage
                                key={message.id}
                                message={messageWithCharacterInstance}
                            />
                        );
                    } else {
                        return (
                            <CharacterStaticMessage
                                key={message.id}
                                message={messageWithCharacterInstance}
                            />
                        );
                    }
                } else {
                    const parsedMessage = JSON.parse(message.content);

                    if (
                        parsedMessage.role == "assistant" &&
                        message.id === streamedMessageId
                    ) {
                        return (
                            <DMStreamedMessage
                                key={message.id}
                                message={message}
                            />
                        );
                    } else if (
                        parsedMessage.role == "assistant" &&
                        parsedMessage.content
                    ) {
                        return (
                            <DMStaticMessage
                                key={message.id}
                                message={message}
                            />
                        );
                    } else if (
                        parsedMessage.role == "assistant" &&
                        parsedMessage.tool_calls
                    ) {
                        return (
                            <DMToolCallMessage
                                key={message.id}
                                message={message}
                            />
                        );
                    } else if (parsedMessage.role == "tool") {
                        return (
                            <DMToolCallResultMessage
                                key={message.id}
                                message={message}
                            />
                        );
                    }
                }
            })}
        </div>
    );
}
