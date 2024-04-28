import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { LobbyControls } from "@/components/lobby/LobbyControls";
import fantasyforgelogo from "@/assets/images/logos/fantasyforgelogocropped.png";
import { useGameStore } from "@/lib/game";
import { useEffect } from "react";

export const Route = createFileRoute("/lobby")({
    component: Layout,
});

function Layout() {
    const navigate = useNavigate();
    const inGame = useGameStore().gameState?.state === "IN_GAME";

    // TODO: does this make the game start message kinda redundant?
    useEffect(() => {
        if (inGame) {
            navigate({
                to: "/game",
            });
        }
    }, [navigate, inGame]);

    return (
        <div className='relative w-screen h-screen bg-[#01131D]'>
            <div className='absolute flex justify-between items-start z-40 w-full p-[1vw]'>
                <img
                    src={fantasyforgelogo}
                    className='z-10 w-[8vw]'
                    alt='Fantasy Fogo Logo'
                />
                <LobbyControls />
            </div>
            <Outlet />
        </div>
    );
}
