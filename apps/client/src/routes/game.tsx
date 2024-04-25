import { createFileRoute } from "@tanstack/react-router";
import fantasyforgelogo from "@/assets/images/logos/fantasyforgelogocroppednotext.png";
import { SettingsButton } from "@/components/lobby/SettingsButton";
import { Icons } from "@/components/Icons";
import { useGameStore } from "@/lib/game";
import { GameCharacterPortrait } from "@/components/game/GameCharacterPortrait";
import { GameChat } from "@/components/game/GameChat";

export const Route = createFileRoute("/game")({
    component: () => <GameLayout />,
});

function GameLayout() {
    const connectedPlayers = useGameStore().state?.connectedPlayers;

    return (
        <div className='w-screen h-screen relative bg-[#01131D]'>
            <div className='h-full absolute flex flex-col justify-between top-0 left-0 p-[1vw]'>
                <img
                    src={fantasyforgelogo}
                    className='z-10 w-[3vw]'
                    alt='Fantasy Fogo Logo'
                />
                <div className=''>
                    {connectedPlayers?.map((player) => (
                        <GameCharacterPortrait
                            key={player.user.id}
                            user={player.user}
                            character={player.character}
                        />
                    ))}
                </div>
                <div className='flex flex-col gap-y-2'>
                    <Icons.music
                        className='w-[2vw] h-[2vw] text-white cursor-pointer hover:scale-105'
                        onClick={() => {}}
                    />
                    <SettingsButton />
                </div>
            </div>
            <div className='flex w-full h-full'>
                <div className='w-4/5 h-full flex justify-center'>
                    <GameChat />
                </div>
                <div className='w-1/5 h-full border-l border-white'></div>
            </div>
        </div>
    );
}