import { useEffect } from "react";
import { useGameStore } from "@/game";
import readySound from "@/assets/sfx/lobby/ready.mp3";
import clickSound from "@/assets/sfx/lobby/click.mp3";
import fantasyforgelogo from "@/assets/images/logos/fantasyforgelogocropped.png";
import campaignCover from "@/assets/images/game/campaigncover.png";

import { cn } from "@/lib/utils";
import { LobbyControls } from "./LobbyControls";
import { CharacterPortrait } from "./CharacterPortrait";
import { AddPlayerButton } from "./AddPlayerButton";
import { useMusicStore } from "@/game/music";
import { sendMessage } from "@/websocket";

type LobbyProps = {
    className?: string;
};

export function Lobby({ className }: LobbyProps) {
    const user = useGameStore((state) => state.user);

    const connectedPlayers = useGameStore((state) => state.connectedPlayers);

    const gameState = useGameStore((state) => state.gameState);
    const setGameState = useGameStore((state) => state.setGameState);

    const play = useMusicStore((state) => state.play);

    useEffect(() => {
        play();
    }, [play]);

    const toggleReady = () => {
        if (!user) return;
        if (!gameState.readyUserIds.includes(user.id)) {
            const readySfx = new Audio(readySound);
            readySfx.play();

            const newGameState = {
                readyUserIds: [...gameState.readyUserIds, user.id],
            };

            setGameState(newGameState);
            sendMessage(
                JSON.stringify({
                    type: "GameStateUpdateRequest",
                    data: {
                        gameState: newGameState,
                    },
                })
            );
        } else {
            const clickSfx = new Audio(clickSound);
            clickSfx.play();

            const newGameState = {
                readyUserIds: gameState.readyUserIds.filter(
                    (id) => id !== user.id
                ),
            };

            setGameState(newGameState);
            sendMessage(
                JSON.stringify({
                    type: "GameStateUpdateRequest",
                    data: {
                        gameState: newGameState,
                    },
                })
            );
        }
    };

    if (!user) return null; // Invalid state

    return (
        <div className={cn("w-screen h-screen bg-[#01131D]", className)}>
            <div className='flex w-full h-full'>
                <div className='relative flex flex-col justify-between w-1/2 p-8'>
                    <div className='absolute inset-0 z-10 w-full h-full bg-gradient-to-t from-black/50 to-transparent' />
                    <div className='absolute inset-0 z-10 w-full h-full bg-gradient-to-b from-black/30 to-transparent' />
                    <img
                        src={campaignCover}
                        className='absolute inset-0 object-cover w-full h-full'
                        alt='Campaign Cover'
                    />
                    <img
                        src={fantasyforgelogo}
                        className='z-10 w-32'
                        alt='Fantasy Fogo Logo'
                    />
                    <div className='z-20 flex flex-col gap-y-2'>
                        <div className='font-sans text-5xl font-bold text-white drop-shadow-xl max-w-[80%]'>
                            The Forbidden Tower
                        </div>
                        <div className='font-sans text-md font-light text-neutral-300 drop-shadow-xl max-w-[80%]'>
                            Ancient power awakens as a legendary tower, steeped
                            in forbidden magic, emerges from the mists,
                            promising untold riches and arcane knowledge to
                            those brave enough to face its dark mysteries.
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-between w-1/2 p-8'>
                    <LobbyControls />
                    <div className='grid w-full grid-cols-3 gap-4 place-items-center'>
                        {connectedPlayers.map((user) => {
                            const ready = gameState.readyUserIds.includes(
                                user.id
                            );

                            return (
                                <CharacterPortrait
                                    key={user.id}
                                    user={user}
                                    ready={ready}
                                />
                            );
                        })}
                        {connectedPlayers.length < 6 && <AddPlayerButton />}
                    </div>
                    <div className='flex items-center justify-end w-full'>
                        <div
                            className='text-5xl font-bold text-white cursor-pointer drop-shadow-xl hover:scale-105'
                            onClick={toggleReady}
                        >
                            {gameState.readyUserIds.includes(user.id)
                                ? "Unready"
                                : "Ready"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
