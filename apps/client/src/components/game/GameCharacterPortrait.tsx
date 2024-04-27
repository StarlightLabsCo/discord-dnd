import { CharacterInstance, User } from "database";
import { DiscordAvatar } from "../DiscordAvatar.js";
import { s3UrlRewriter } from "@/lib/discord/utils";

type GameCharacterPortraitProps = {
    user: User;
    character: CharacterInstance | null;
    isCurrentUser?: boolean;
};

// TODO: implement the ability to view your own character stats/inventory

export function GameCharacterPortrait({
    user,
    character,
    isCurrentUser,
}: GameCharacterPortraitProps) {
    return (
        <div className='relative w-[8vw] h-[8vw] border border-white aspect-square shrink-0 rounded-[0.8vw]'>
            <div className='relative group w-[8vw] h-[8vw]'>
                {character && (
                    <img
                        src={s3UrlRewriter(character.imageUrl)}
                        className='w-[8vw] h-[8vw] object-cover rounded-[1vw]'
                        alt='Character Portrait'
                    />
                )}
                {isCurrentUser && (
                    <div className='flex absolute inset-0 z-20 flex-col justify-center items-center w-full h-full opacity-0 bg-black/30 group-hover:opacity-100'>
                        hi
                    </div>
                )}
            </div>
            <DiscordAvatar
                user={user}
                className='absolute right-0 bottom-0 z-20 w-[2vw] h-[2vw] rounded-full border border-white translate-x-1/2 translate-y-1/2'
            />
        </div>
    );
}
