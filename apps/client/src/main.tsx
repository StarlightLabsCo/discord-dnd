import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
    RoutePaths,
    RouterProvider,
    createRouter,
} from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });
export type AppLayoutPaths = RoutePaths<typeof routeTree>;

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
