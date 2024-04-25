import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import { CharacterPreview } from "@/components/lobby/character/CharacterPreview";
import { SidebarLinks } from "@/components/lobby/character/SidebarLinks";
import { useCharacterEditorStore } from "@/lib/game/characterEditor";

export const Route = createFileRoute("/lobby/character")({
    component: Layout,
});

function Layout() {
    const { saveCharacter } = useCharacterEditorStore();

    return (
        <div className='flex relative items-center w-screen h-screen text-white'>
            <SidebarLinks className='w-1/5' />
            <div className='flex-1 max-w-[calc(80%-30vw)]'>
                <Outlet />
            </div>
            <CharacterPreview />
            <div className='absolute bottom-[1vw] left-[1vw] hover:scale-105'>
                <Link
                    to='/lobby'
                    className='text-[3.5vw] font-bold text-white drop-shadow-xl cursor-pointer'
                    onClick={saveCharacter}
                >
                    Lobby
                </Link>
            </div>
        </div>
    );
}
    