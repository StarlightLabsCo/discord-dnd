import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useGameStore } from "@/lib/game";
import readySound from "@/assets/sfx/lobby/ready.mp3";
import campaignCover from "@/assets/images/campaign/cover.png";

import { CharacterPortrait } from "@/components/lobby/CharacterPortrait";
import { AddPlayerButton } from "@/components/lobby/AddPlayerButton";
import { useMusicStore } from "@/lib/game/music";
import { sendMessage } from "@/lib/websocket";
import { useCampaignStore } from "@/lib/game/campaign";

export const Route = createFileRoute("/_layout/lobby")({
    component: Lobby,
});

function Lobby() {
    const user = useGameStore((state) => state.user);

    const connectedPlayers = useGameStore((state) => state.connectedPlayers);

    const title = useCampaignStore((state) => state.title);
    const description = useCampaignStore((state) => state.description);

    const play = useMusicStore((state) => state.play);

    useEffect(() => {
        play();
    }, [play]);

    const toggleReady = () => {
        if (!user) return;
        // if (!gameState.readyUserIds.includes(user.id)) {
        //     const readySfx = new Audio(readySound);
        //     readySfx.play();

        //     const newGameState = {
        //         readyUserIds: [...gameState.readyUserIds, user.id],
        //     };

        //     setGameState(newGameState);
        //     sendMessage(
        //         JSON.stringify({
        //             type: "GameStateUpdateRequest",
        //             data: newGameState,
        //         } as GameStateUpdateRequest)
        //     );
        // } else {
        //     const newGameState = {
        //         readyUserIds: gameState.readyUserIds.filter(
        //             (id) => id !== user.id
        //         ),
        //     };

        //     setGameState(newGameState);
        //     sendMessage(
        //         JSON.stringify({
        //             type: "GameStateUpdateRequest",
        //             data: newGameState,
        //         } as GameStateUpdateRequest)
        //     );
        // }
    };

    if (!user) return null; // Invalid state

    return (
        <div className={"w-screen h-screen"}>
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
                            {title}
                        </div>
                        <div className='font-sans text-[1.2vw] font-light text-neutral-300 drop-shadow-xl max-w-[80%]'>
                            {description}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-between p-[1vw] w-1/2'>
                    <div />
                    <div className='grid grid-cols-3 gap-[2vw] place-items-center w-full'>
                        {connectedPlayers.map((connectedPlayer) => {
                            return (
                                <CharacterPortrait
                                    key={connectedPlayer.user.id}
                                    user={connectedPlayer.user}
                                    character={connectedPlayer.character}
                                    isCurrentUser={
                                        connectedPlayer.user.id === user.id
                                    }
                                    ready={connectedPlayer.ready}
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
                            {/* {connectedPlayers.find((p) => p.user.id === user.id)
                                .ready
                                ? "Ready"
                                : "Unready"} */}
                            Ready
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
