import { useRouterState } from "@tanstack/react-router";

import { AppLayoutPaths } from "@/main";
import { origins } from "@/game/origins";
import { races } from "@/game/races";
import { classes } from "@/game/classes";

import { useCharacterContext } from "@/components/lobby/character/CharacterContext";
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

    const { originId, raceId, archetypeId, background } = useCharacterContext(); // archetype = class (changed to avoid keyword conflict)

    const sidebarLinks: {
        to: AppLayoutPaths;
        text: string;
        subtext?: string;
    }[] = [
        {
            to: "/lobby/character/origin",
            text: "Origin",
            subtext: origins[originId].title,
        },
        {
            to: "/lobby/character/race",
            text: "Race",
            subtext: races[raceId].title,
        },
        {
            to: "/lobby/character/class",
            text: "Class",
            subtext: classes[archetypeId].title,
        },
        {
            to: "/lobby/character/abilities",
            text: "Abilities",
            subtext: "",
        },
        {
            to: "/lobby/character/background",
            text: "Lore",
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
            <div className='flex flex-col gap-y-[1vw] w-3/4'>
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
