import { useEffect } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { setupDiscordSDK, useDiscordStore } from "../lib/discord";
import { useWebsocketStore } from "../lib/websocket";
import { useAudioStore } from "@/lib/game/audio";

export const Route = createRootRoute({
    component: App,
});

function App() {
    const auth = useDiscordStore((state) => state.auth);
    const connect = useWebsocketStore((state) => state.connect);
    const setupAudio = useAudioStore((state) => state.setupAudioNodes);

    useEffect(() => {
        setupDiscordSDK();
        setupAudio();
    }, []);

    useEffect(() => {
        if (auth != null) {
            connect();
        }
    }, [connect, auth]);

    // TODO: add a debug flag to enable/disable devtools
    return (
        <>
            <Outlet />
        </>
    );
}
