import { useEffect } from "react";
import { setup, useDiscordStore } from "./discord";
import { useWebsocketStore } from "./websocket";
import { LoadingScreen } from "./components/LoadingScreen";
import { Lobby } from "./components/Lobby";
import { useGameStore } from "./game";

import {
    createBrowserRouter,
    RouterProvider,
    useNavigate,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoadingScreen />,
    },
    {
        path: "/lobby",
        element: <Lobby />,
    },
]);

function App() {
    const auth = useDiscordStore((state) => state.auth);
    const connect = useWebsocketStore((state) => state.connect);
    const user = useGameStore((state) => state.user);

    const navigate = useNavigate();

    useEffect(() => {
        setup();
    }, []);

    useEffect(() => {
        if (auth != null) {
            connect();
        }
    }, [connect, auth]);

    useEffect(() => {
        if (user != null) {
            navigate("/lobby");
        }
    }, [user, navigate]);

    return <RouterProvider router={router} />;
}

export default App;
