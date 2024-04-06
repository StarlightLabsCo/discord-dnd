import { useState } from "react";
import {
    createLazyFileRoute,
    Link,
    Outlet,
    useRouterState,
} from "@tanstack/react-router";

import { CharacterPreview } from "@/components/lobby/character/CharacterPreview";
import { SidebarLink } from "@/components/lobby/character/SidebarLink";

export const Route = createLazyFileRoute("/lobby/character/_layout")({
    component: Layout,
});

function Layout() {
    const location = useRouterState({ select: (s) => s.location });

    const [origin, setOrigin] = useState<string>("Custom");
    const [race, setRace] = useState<string>("Dwarf");
    const [subrace, setSubrace] = useState<string>("Hill Dwarf");
    const [calling, setCalling] = useState<string>("Rogue");
    const [background, setBackground] = useState<string>("");

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const sidebarLinks = [
        { to: "/lobby/character/origin", text: "Origin", subtext: origin },
        { to: "/lobby/character/race", text: "Race", subtext: race },
        {
            to: "/lobby/character/subrace",
            text: "Subrace",
            subtext: subrace,
        },
        { to: "/lobby/character/class", text: "Class", subtext: calling }, // calling is the same as class (changed to avoid keyword conflict)
        {
            to: "/lobby/character/background",
            text: "Background",
            subtext: background,
        },
    ] as { to: string; text: string; subtext?: string }[];

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
