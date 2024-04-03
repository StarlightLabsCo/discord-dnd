import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { App } from "./App";
import { LoadingScreen } from "./pages/loading/LoadingScreen";

import { LobbyLayout } from "./pages/lobby/LobbyLayout";
import { Lobby } from "./pages/lobby/Lobby";

import { CharacterCreatorLayout } from "./pages/lobby/character/CharacterCreatorLayout";
import { Origin } from "./pages/lobby/character/Origin";
import { Race } from "./pages/lobby/character/Race";
import { Subrace } from "./pages/lobby/character/Subrace";
import { Class } from "./pages/lobby/character/Class";
import { Background } from "./pages/lobby/character/Background";
import { Abilities } from "./pages/lobby/character/Abilities";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <LoadingScreen />,
            },
            {
                path: "lobby",
                element: <LobbyLayout />,
                children: [
                    {
                        index: true,
                        element: <Lobby />,
                    },
                    {
                        path: "character",
                        element: <CharacterCreatorLayout />,
                        children: [
                            {
                                index: true,
                                element: <Origin />,
                            },
                            {
                                path: "race",
                                element: <Race />,
                            },

                            {
                                path: "subrace",
                                element: <Subrace />,
                            },
                            {
                                path: "class",
                                element: <Class />,
                            },
                            {
                                path: "background",
                                element: <Background />,
                            },
                            {
                                path: "abilities",
                                element: <Abilities />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
