import { Outlet, createFileRoute } from "@tanstack/react-router";
import { LobbyControls } from "@/components/lobby/LobbyControls";
import fantasyforgelogo from "@/assets/images/logos/fantasyforgelogocropped.png";

export const Route = createFileRoute("/lobby")({
    component: Layout,
});

function Layout() {
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
