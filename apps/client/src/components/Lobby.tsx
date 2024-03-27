import { useEffect, useState } from "react";
import { useGameStore } from "@/game";
import startupSound from "@/assets/sfx/lobby/startup.mp3";
import readySound from "@/assets/sfx/lobby/ready.mp3";
import clickSound from "@/assets/sfx/lobby/click.mp3";
import fantasyforgelogo from "@/assets/fantasyforgelogocropped.png";
import campaignCover from "@/assets/campaigncover.png";

import { cn } from "@/lib/utils";
import { LobbyControls } from "./LobbyControls";
import { CharacterPortrait } from "./CharacterPortrait";
import { AddPlayerButton } from "./AddPlayerButton";

type LobbyProps = {
    className?: string;
};

export function Lobby({ className }: LobbyProps) {
    const connectedPlayers = useGameStore((state) => state.connectedPlayers);
    const [ready, setReady] = useState(false); // TODO: swap this with useGameStore

    useEffect(() => {
        const audio = new Audio(startupSound);
        audio.play();
    }, []);

    const toggleReady = () => {
        if (!ready) {
            const readySfx = new Audio(readySound);
            readySfx.play();
            setReady(true);
        } else {
            const clickSfx = new Audio(clickSound);
            clickSfx.play();
            setReady(false);
        }
    };

    return (
        <div className={cn("w-screen h-screen bg-[#01131D]", className)}>
            <div className='flex w-full h-full'>
                <div className='relative flex flex-col justify-between w-1/2 p-8'>
                    <div className='absolute inset-0 z-10 w-full h-full bg-gradient-to-t from-black/30 to-transparent' />
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
                    <div className='z-20 font-sans text-5xl font-bold text-white drop-shadow-xl'>
                        The Forbidden Tower
                    </div>
                </div>
                <div className='flex flex-col justify-between w-1/2 p-8'>
                    <LobbyControls />
                    <div className='grid w-full grid-cols-3 gap-4 place-items-center'>
                        {connectedPlayers.map((user) => (
                            <CharacterPortrait key={user.id} user={user} />
                        ))}
                        {connectedPlayers.length < 6 && <AddPlayerButton />}
                    </div>
                    <div className='flex items-center justify-end w-full'>
                        <div
                            className='text-5xl font-bold text-white cursor-pointer drop-shadow-xl hover:scale-105'
                            onClick={toggleReady}
                        >
                            {ready ? "Unready" : "Ready"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
