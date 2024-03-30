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
import { GameStateUpdateRequest } from "starlight-api-types/websocket";

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
                    data: newGameState,
                } as GameStateUpdateRequest)
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
                    data: newGameState,
                } as GameStateUpdateRequest)
            );
        }
    };

    if (!user) return null; // Invalid state

    return (
        <div className={cn("w-screen h-screen bg-[#01131D]", className)}>
            <div className='flex w-full h-full'>
                <div className='flex relative flex-col justify-between p-[2vw] w-1/2'>
                    <div className='absolute inset-0 z-10 w-full h-full bg-gradient-to-t to-transparent from-black/50' />
                    <div className='absolute inset-0 z-10 w-full h-full bg-gradient-to-b to-transparent from-black/30' />
                    <img
                        src={campaignCover}
                        className='object-cover absolute inset-0 w-full h-full'
                        alt='Campaign Cover'
                    />
                    <img
                        src={fantasyforgelogo}
                        className='z-10 w-[10vw]'
                        alt='Fantasy Fogo Logo'
                    />
                    <div className='flex z-20 flex-col gap-y-[1vw]'>
                        <div className='font-sans text-[3.5vw] leading-none font-bold text-white drop-shadow-xl max-w-[85%]'>
                            The Forbidden Tower
                        </div>
                        <div className='font-sans text-[1.2vw] font-light text-neutral-300 drop-shadow-xl max-w-[80%]'>
                            Ancient power awakens as a legendary tower, steeped
                            in forbidden magic, emerges from the mists,
                            promising untold riches and arcane knowledge to
                            those brave enough to face its dark mysteries.
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-between p-[1vw] w-1/2'>
                    <LobbyControls />
                    <div className='grid grid-cols-3 gap-[2vw] place-items-center w-full shrink-0'>
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
                    <div className='flex justify-end items-center w-full'>
                        <div
                            className='text-[3.5vw] font-bold text-white drop-shadow-xl cursor-pointer hover:scale-105'
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
