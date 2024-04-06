import { Outlet } from "react-router-dom";
import { LobbyControls } from "@/components/lobby/LobbyControls";
import fantasyforgelogo from "@/assets/images/logos/fantasyforgelogocropped.png";

export function LobbyLayout() {
    return (
        <div className='relative w-screen h-screen'>
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
