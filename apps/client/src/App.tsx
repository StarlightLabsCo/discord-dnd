import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { setup, useDiscordStore } from "./lib/discord";
import { useWebsocketStore } from "./lib/websocket";

export function App() {
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

    return <Outlet />;
}
