import { useWebsocketStore } from "@/lib/websocket";
import { useState } from "react";
import { SendMessageRequest } from "starlight-api-types/websocket";

export function GameChatInput() {
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        const { ws } = useWebsocketStore.getState();

        ws?.send(
            JSON.stringify({
                type: "SendMessageRequest",
                data: {
                    message,
                },
            } as SendMessageRequest)
        );

        setMessage("");
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className='shrink-0 w-3/5 h-[3.5vh] bg-[#273747] text-white text-[1vw] rounded-full mb-[1vh] px-[1.4vw] py-[1vw]'
        />
    );
}
