import { useEffect } from "react";
import { useGameStore } from "@/lib/game";

import { GameStateUpdateRequest } from "starlight-api-types/websocket";

import { sendMessage } from "@/lib/websocket";
import { useMusicStore } from "@/lib/game/music";

import { CharacterPortrait } from "@/components/lobby/CharacterPortrait";
import { AddPlayerButton } from "@/components/lobby/AddPlayerButton";

import campaignCover from "@/assets/images/game/campaigncover.png";
import clickSound from "@/assets/sfx/lobby/click.mp3";
import readySound from "@/assets/sfx/lobby/ready.mp3";

export function Lobby() {
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
        <div className='w-screen h-screen bg-[#01131D]'>
            <div className='flex w-full h-full'>
                <div className='flex relative flex-col justify-end p-[2vw] w-1/2'>
                    <div className='absolute inset-0 z-10 w-full h-full bg-gradient-to-t to-transparent from-black/50' />
                    <div className='absolute inset-0 z-10 w-full h-full bg-gradient-to-b to-transparent from-black/30' />
                    <img
                        src={campaignCover}
                        className='object-cover absolute inset-0 w-full h-full'
                        alt='Campaign Cover'
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
                    <div />
                    <div className='grid grid-cols-3 gap-[2vw] place-items-center w-full'>
                        {connectedPlayers.map((connectedPlayer) => {
                            const ready = gameState.readyUserIds.includes(
                                connectedPlayer.id
                            );

                            return (
                                <CharacterPortrait
                                    key={connectedPlayer.id}
                                    user={connectedPlayer}
                                    isCurrentUser={
                                        connectedPlayer.id === user.id
                                    }
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
