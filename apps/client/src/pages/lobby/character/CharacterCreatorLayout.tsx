import { cn } from "@/lib/utils";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarLink } from "./SidebarLink";
import { CharacterPreview } from "./CharacterPreview";

type CharacterCreatorLayoutProps = {
    className?: string;
};

export function CharacterCreatorLayout({
    className,
}: CharacterCreatorLayoutProps) {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const sidebarLinks = [
        { to: "/lobby/character", text: "Origin", subtext: "Valeria" },
        { to: "/lobby/character/race", text: "Race", subtext: "Elf" },
        {
            to: "/lobby/character/subrace",
            text: "Subrace",
            subtext: "High Elf",
        },
        { to: "/lobby/character/class", text: "Class", subtext: "Wizard" },
        { to: "/lobby/character/background", text: "Background", subtext: "" },
    ];

    return (
        <div
            className={cn(
                "w-screen h-screen bg-[#01131D] flex items-center text-white",
                className
            )}
        >
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
        </div>
    );
}
