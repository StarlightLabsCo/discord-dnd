import { useRouterState } from "@tanstack/react-router";

import { AppLayoutPaths } from "@/main";
import { cn } from "@/lib/tailwind/utils";
import { SidebarLink } from "./SidebarLink";
import { useCharacterEditorStore } from "@/lib/game/characterEditor";

type SidebarLinksProps = {
    className?: string;
};

export function SidebarLinks({ className }: SidebarLinksProps) {
    const location = useRouterState({ select: (s) => s.location });

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const { draftCharacter } = useCharacterEditorStore();
    if (!draftCharacter) {
        return null;
    }

    const sidebarLinks: {
        to: AppLayoutPaths;
        text: string;
        subtext?: string;
    }[] = [
        {
            to: "/lobby/character/origin",
            text: "Origin",
            subtext: draftCharacter.characterId ? "test" : "Custom",
        },
        {
            to: "/lobby/character/race",
            text: "Race",
            subtext: draftCharacter.race.name,
        },
        {
            to: "/lobby/character/class",
            text: "Class",
            subtext: draftCharacter.class.name,
        },
        {
            to: "/lobby/character/abilities",
            text: "Abilities",
            subtext: "",
        },
        {
            to: "/lobby/character/lore",
            text: "Lore & Appearance",
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
