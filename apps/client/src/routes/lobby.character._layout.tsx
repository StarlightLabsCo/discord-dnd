import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import { CharacterPreview } from "@/components/lobby/character/CharacterPreview";
import { SidebarLinks } from "@/components/lobby/character/SidebarLinks";
import { CharacterProvider } from "@/contexts/CharacterContext";

export const Route = createFileRoute("/lobby/character/_layout")({
    component: Layout,
});

function Layout() {
    return (
        <CharacterProvider>
            <div className='w-screen h-screen bg-[#01131D] flex items-center text-white relative'>
                <SidebarLinks className='w-1/5' />
                <div className='flex-1'>
                    <Outlet />
                </div>
                <CharacterPreview />
                <div className='absolute bottom-[1vw] left-[1vw] hover:scale-105'>
                    <Link
                        to='/lobby'
                        className='text-[3.5vw] font-bold text-white drop-shadow-xl cursor-pointer'
                    >
                        Lobby
                    </Link>
                </div>
            </div>
        </CharacterProvider>
    );
}
