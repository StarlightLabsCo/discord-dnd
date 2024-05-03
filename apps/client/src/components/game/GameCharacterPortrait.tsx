import { CharacterInstance, Feat, Proficiency, User } from "database";
import { DiscordAvatar } from "../DiscordAvatar.js";
import { s3UrlRewriter } from "@/lib/discord/utils";
import { useGameStore } from "@/lib/game/";
import { PlayerMenu } from "./dialogs/PlayerMenu.js";

type GameCharacterPortraitProps = {
    characterInstance: CharacterInstance & {
        user: User | null;
        feats: Feat[];
        proficiencies: Proficiency[];
    };
    user: User | null;
    isCurrentUser?: boolean;
};

export function GameCharacterPortrait({
    characterInstance,
}: GameCharacterPortraitProps) {
    const gameStoreUser = useGameStore().user; // self
    const characterInstanceUser = characterInstance?.user; // other

    const connectedPlayers = useGameStore().gameState?.connectedPlayers;
    const isUserConnected = connectedPlayers?.some(
        (player) => player.user?.id === characterInstanceUser?.id
    );

    const { setPlayerMenuDialogOpen } = useGameStore();

    return (
        <>
            <div className='relative flex items-center justify-center w-[8vw] h-[8vw] border-[0.1vw] border-white aspect-square shrink-0 rounded-[0.8vw]'>
                <div className='relative group w-[7.8vw] h-[7.8vw]'>
                    {characterInstance && (
                        <img
                            src={s3UrlRewriter(characterInstance.imageUrl)}
                            className='w-[7.8vw] h-[7.8vw] object-cover rounded-[1vw]'
                            alt='Character Portrait'
                        />
                    )}
                    {gameStoreUser?.id == characterInstanceUser?.id && (
                        <div
                            onClick={() => setPlayerMenuDialogOpen(true)}
                            className='cursor-pointer hover:scale-120 flex absolute inset-0 z-20 flex-col justify-center items-center w-full h-full opacity-0 text-white bg-black/30 group-hover:opacity-100 rounded-[1vw]'
                        >
                            Inventory
                        </div>
                    )}
                </div>
                {characterInstanceUser && (
                    <DiscordAvatar
                        user={characterInstanceUser}
                        className={`absolute right-0 bottom-0 z-20 w-[2vw] h-[2vw] rounded-full border ${isUserConnected ? "border-white" : "border-red-500"} translate-x-1/2 translate-y-1/2`}
                    />
                )}
            </div>
            <PlayerMenu characterInstance={characterInstance} />
        </>
    );
}
