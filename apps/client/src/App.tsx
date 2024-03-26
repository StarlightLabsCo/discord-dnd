import { useEffect } from "react";
import { setup, useDiscordStore } from "./discord";
import { useWebsocketStore } from "./websocket";
import { LoadingScreen } from "./components/LoadingScreen";

function App() {
    const instanceId = useDiscordStore((state) => state.instanceId);
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

    if (ws) {
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
                    WebSocket: Connected
                </div>
            </>
        );
    }

    return <LoadingScreen />;
}

export default App;
