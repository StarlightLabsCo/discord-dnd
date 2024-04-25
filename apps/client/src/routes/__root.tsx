import { useEffect } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { setup, useDiscordStore } from "../lib/discord";
import { useWebsocketStore } from "../lib/websocket";

export const Route = createRootRoute({
    component: App,
});

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

    // TODO: add a debug flag to enable/disable devtools
    return (
        <>
            <Outlet />
        </>
    );
}
