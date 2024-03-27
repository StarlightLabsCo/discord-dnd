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

    return auth === null ? <LoadingScreen /> : <Lobby />;
}

export default App;
