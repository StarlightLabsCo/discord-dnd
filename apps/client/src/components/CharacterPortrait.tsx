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
        <div className='relative w-48 h-48 border border-white aspect-square'>
            {ready && (
                <div className='absolute inset-0 z-10 flex items-end w-full h-full text-5xl font-bold text-white pb-[10%] justify-center bg-black/30'>
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
                className='absolute bottom-0 right-0 z-20 w-8 h-8 translate-x-1/2 translate-y-1/2 border border-white rounded-full'
            />
        </div>
    );
}
