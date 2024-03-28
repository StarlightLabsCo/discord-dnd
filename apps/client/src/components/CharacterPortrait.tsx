import { User } from "database";
import { characters } from "@/assets/images/characters";
import { DiscordAvatar } from "./DiscordAvatar";

type CharacterPortraitProps = {
    user: User;
};

export function CharacterPortrait({ user }: CharacterPortraitProps) {
    const index = Number(BigInt(user.id) % BigInt(16));

    return (
        <div className='relative w-48 h-48 border border-white aspect-square'>
            <img
                src={characters[index]}
                className='object-cover w-full h-full'
                alt='Character Portrait'
            />
            <DiscordAvatar
                user={user}
                className='absolute bottom-0 right-0 z-10 w-8 h-8 translate-x-1/2 translate-y-1/2 border border-white rounded-full'
            />
        </div>
    );
}
