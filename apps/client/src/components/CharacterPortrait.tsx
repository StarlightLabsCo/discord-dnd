import { User } from "database";
import { characters } from "@/assets/images/characters";
import { DiscordAvatar } from "./DiscordAvatar";

type CharacterPortraitProps = {
    user: User;
    ready?: boolean;
};

export function CharacterPortrait({ user, ready }: CharacterPortraitProps) {
    const index = Number(BigInt(user.id) % BigInt(16));

    return (
        <div className='relative w-[14vw] h-[14vw] border border-white aspect-square shrink-0'>
            {ready && (
                <div className='absolute inset-0 z-10 flex items-end w-full h-full text-[3.5vw] leading-none font-bold text-white pb-[10%] justify-center bg-black/30'>
                    Ready
                </div>
            )}
            <img
                src={characters[index]}
                className='object-cover w-full h-full'
                alt='Character Portrait'
            />
            <DiscordAvatar
                user={user}
                className='absolute right-0 bottom-0 z-20 w-[3vw] h-[3vw] rounded-full border border-white translate-x-1/2 translate-y-1/2 w'
            />
        </div>
    );
}
