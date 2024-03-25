import { useEffect, useState } from "react";
import { setup } from "./discord";
import { useDiscordStore } from "./stores/discord-store";
import { useWebsocketStore } from "./stores/websocket-store";

function App() {
    const instanceId = useDiscordStore((state) => state.instanceId);
    const auth = useDiscordStore((state) => state.auth);

    const connect = useWebsocketStore((state) => state.connect);
    const ws = useWebsocketStore((state) => state.ws);

    // debug
    const debugMessages = useWebsocketStore((state) => state.debugMessages);

    useEffect(() => {
        setup();
    }, []);

    useEffect(() => {
        if (auth != null) {
            connect();
        }
    }, [connect, auth]);

    const sendMessage = (message: string) => {
        if (ws != null) {
            ws.send(message);
        }
    };

    const [inputValue, setInputValue] = useState("");

    return (
        <>
            <div className='text-lg font-bold'>Hello World!</div>
            <div className='text-sm text-gray-500'>
                This is a Discord D&D app
            </div>
            <div className='text-sm text-gray-500'>
                Instance ID: {instanceId ?? "Not set"}
            </div>
            <div className='text-sm text-gray-500'>
                Authenticated: {auth != null ? "True" : "False"}
            </div>
            {auth != null && (
                <div className='text-sm text-gray-500'>
                    User: {auth.user.username}#{auth.user.discriminator}
                </div>
            )}
            <div className='text-sm text-gray-500'>
                WebSocket: {ws != null ? "Connected" : "Disconnected"}
            </div>
            <input
                type='text'
                className='border'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {/* Added button to send message */}
            <button
                className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'
                onClick={() => {
                    sendMessage(inputValue);
                    setInputValue(""); // Clear input after sending
                }}
            >
                Send
            </button>
            <div className='text-sm text-gray-500'>
                Debug Messages:
                {debugMessages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
        </>
    );
}

export default App;
