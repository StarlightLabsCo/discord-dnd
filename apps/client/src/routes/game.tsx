import { createFileRoute } from "@tanstack/react-router";
import fantasyforgelogo from "@/assets/images/logos/fantasyforgelogocroppednotext.png";
import { SettingsButton } from "@/components/lobby/SettingsButton";
import { Icons } from "@/components/Icons";
import { GameChat } from "@/components/game/GameChat";
import { GameChatInput } from "@/components/game/GameChatInput";
import { PartyDisplay } from "@/components/game/PartyDisplay";

export const Route = createFileRoute("/game")({
    component: () => <GameLayout />,
});

function GameLayout() {
    return (
        <div className='w-screen h-screen relative bg-[#01131D]'>
            <div className='h-full absolute flex flex-col justify-between top-0 left-0 p-[1vw]'>
                <img
                    src={fantasyforgelogo}
                    className='z-10 w-[3vw]'
                    alt='Fantasy Fogo Logo'
                />
                <PartyDisplay />
                <div className='flex flex-col gap-y-2'>
                    <Icons.music
                        className='w-[2vw] h-[2vw] text-white cursor-pointer hover:scale-105'
                        onClick={() => {}}
                    />
                    <SettingsButton />
                </div>
            </div>
            <div className='flex w-full h-full'>
                <div className='w-[10vw] shrink-0' /> {/* width of sidebar */}
                <div className='flex flex-col items-center grow h-full overflow-y-scroll gap-y-[4vh]'>
                    <GameChat />
                    <GameChatInput />
                </div>
                <div className='shrink-0 w-1/5 h-full border-l border-white'></div>
            </div>
        </div>
    );
}
