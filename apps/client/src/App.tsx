import { useEffect } from "react";
import { setup } from "./discord";
import { useDiscordStore } from "./stores/discord-store";
import { useWebsocketStore } from "./stores/websocket-store";

function App() {
    const auth = useDiscordStore((state) => state.auth);

    const connect = useWebsocketStore((state) => state.connect);
    const ws = useWebsocketStore((state) => state.ws);

    useEffect(() => {
        setup();
    }, []);

    useEffect(() => {
        if (auth != null) {
            connect();
        }
    }, [connect, auth]);

    return (
        <>
            <div className='text-lg font-bold'>Hello World!</div>
            <div className='text-sm text-gray-500'>
                This is a Discord D&D app
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
        </>
    );
}

export default App;
