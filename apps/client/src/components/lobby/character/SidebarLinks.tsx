import { useRouterState } from "@tanstack/react-router";

import { AppLayoutPaths } from "@/main";
import { useCharacterContext } from "@/contexts/CharacterContext";
import { cn } from "@/lib/tailwind/utils";
import { SidebarLink } from "./SidebarLink";

type SidebarLinksProps = {
    className?: string;
};

export function SidebarLinks({ className }: SidebarLinksProps) {
    const location = useRouterState({ select: (s) => s.location });

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const { origin, race, subrace, archetype, background } =
        useCharacterContext();

    const sidebarLinks: {
        to: AppLayoutPaths;
        text: string;
        subtext?: string;
    }[] = [
        {
            to: "/lobby/character/origin",
            text: "Origin",
            subtext: origin,
        },
        { to: "/lobby/character/race", text: "Race", subtext: race },
        {
            to: "/lobby/character/subrace",
            text: "Subrace",
            subtext: subrace,
        },
        { to: "/lobby/character/class", text: "Class", subtext: archetype }, // archetype = class (changed to avoid keyword conflict)
        {
            to: "/lobby/character/background",
            text: "Background",
            subtext: background,
        },
    ];

    return (
        <div
            className={cn(
                "flex flex-col justify-center items-center",
                className
            )}
        >
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
    );
}
