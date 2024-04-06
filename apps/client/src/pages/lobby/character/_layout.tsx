import { Link, Outlet, useLocation } from "react-router-dom";

import { SidebarLink } from "@/components/lobby/character/SidebarLink";
import { CharacterPreview } from "@/components/lobby/character/CharacterPreview";

export function CharacterCreatorLayout() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const sidebarLinks = [
        { to: "/lobby/character", text: "Origin", subtext: "Custom" },
        { to: "/lobby/character/race", text: "Race", subtext: "Dwarf" },
        {
            to: "/lobby/character/subrace",
            text: "Subrace",
            subtext: "None",
        },
        { to: "/lobby/character/class", text: "Class", subtext: "Rogue" },
        { to: "/lobby/character/background", text: "Background", subtext: "" },
    ];

    return (
        <div className='w-screen h-screen bg-[#01131D] flex items-center text-white relative'>
            <div className='flex flex-col justify-center items-center w-1/5'>
                <div className='flex flex-col gap-y-2 w-3/4'>
                    {sidebarLinks.map(({ to, text, subtext }) => (
                        <SidebarLink
                            key={to}
                            to={to}
                            text={text}
                            subtext={subtext}
                            active={isActive(to)}
                        />
                    ))}
                </div>
            </div>
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
    );
}
