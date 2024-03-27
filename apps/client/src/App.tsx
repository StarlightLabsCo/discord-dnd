import { useEffect } from "react";
import { setup, useDiscordStore } from "./discord";
import { useWebsocketStore } from "./websocket";
import { LoadingScreen } from "./components/LoadingScreen";
import { Lobby } from "./components/Lobby";

function App() {
    const auth = useDiscordStore((state) => state.auth);
    const connect = useWebsocketStore((state) => state.connect);

    useEffect(() => {
        setup();
    }, []);

    useEffect(() => {
        if (auth != null) {
            connect();
        }
    }, [connect, auth]);

    // Debugging
    if (import.meta.env.VITE_DISCORD_EMBED_DEBUG) {
        return <Lobby className='select-none drag-none' />;
    }

    return auth === null ? (
        <LoadingScreen className='select-none drag-none' />
    ) : (
        <Lobby className='select-none drag-none' />
    );
}

export default App;
