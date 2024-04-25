import { CharacterInstance, User } from "database";
import { DiscordAvatar } from "../DiscordAvatar.js";
import { Link } from "@tanstack/react-router";
import { s3UrlRewriter } from "@/lib/discord/utils";

type LobbyCharacterPortraitProps = {
    user: User;
    character: CharacterInstance | null;
    ready?: boolean;
    isCurrentUser?: boolean;
};

export function LobbyCharacterPortrait({
    user,
    character,
    ready,
    isCurrentUser,
}: LobbyCharacterPortraitProps) {
    return (
        <div className='relative w-[14vw] h-[14vw] border border-white aspect-square shrink-0 rounded-[1vw]'>
            {ready && (
                <div className='absolute inset-0 z-10 flex items-end w-full h-full text-[3.5vw] leading-none font-bold text-white pb-[10%] justify-center bg-black/30'>
                    Ready
                </div>
            )}
            <div className='relative group w-[14vw] h-[14vw]'>
                {character && (
                    <img
                        src={s3UrlRewriter(character.imageUrl)}
                        className='w-[14vw] h-[14vw] object-cover rounded-[1vw]'
                        alt='Character Portrait'
                    />
                )}
                {!character && (
                    <div className='flex justify-center items-center w-[14vw] h-[14vw] rounded-[1vw] bg-black/50'>
                        <div className='text-white text-[2vw] font-bold opacity-100'>
                            No character
                        </div>
                    </div>
                )}
                {isCurrentUser && (
                    <div className='flex absolute inset-0 z-20 flex-col justify-center items-center w-full h-full opacity-0 bg-black/30 group-hover:opacity-100'>
                        <Link
                            to='/lobby/character/origin'
                            className='text-white text-[2vw] font-bold opacity-100 cursor-pointer hover:scale-105'
                        >
                            Edit
                        </Link>
                    </div>
                )}
            </div>
            <DiscordAvatar
                user={user}
                className='absolute right-0 bottom-0 z-20 w-[3vw] h-[3vw] rounded-full border border-white translate-x-1/2 translate-y-1/2 w'
            />
        </div>
    );
}
