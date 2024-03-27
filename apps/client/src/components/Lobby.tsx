import { useEffect } from "react";
import { useGameStore } from "@/game";
import startupSound from "@/assets/startup.mp3";
import logo from "@/assets/fantasyforgelogo.png";
import discordSdk from "@/discord";
import { DiscordAvatar } from "./DiscordAvatar";

export function Lobby() {
    const connectedPlayers = useGameStore((state) => state.connectedPlayers);

    useEffect(() => {
        const audio = new Audio(startupSound);
        audio.play();
    }, []);

    const openInviteDialog = async () => {
        await discordSdk.commands.openInviteDialog();
    };

    return (
        <div className='w-screen h-screen bg-[#01131D] p-8'>
            <div className='flex w-full'>
                <div className='flex flex-col w-1/2'>
                    <img
                        src={logo}
                        className='w-32 h-32'
                        alt='Fantasy Fogo Logo'
                    />
                </div>
                <div className='flex flex-col items-center w-1/2 gap-y-2'>
                    {connectedPlayers.map((user, index) => (
                        <div
                            key={index}
                            className='flex items-center w-full px-2 py-1 text-white bg-gray-700 rounded-lg gap-x-2 h-14'
                        >
                            <DiscordAvatar user={user} className='w-8 h-8' />
                            {user.global_name}
                        </div>
                    ))}
                    {connectedPlayers.length < 6 && (
                        <div
                            className='flex items-center w-full px-2 py-1 text-white bg-gray-700 rounded-lg cursor-pointer gap-x-2 h-14 hover:scale-105 hover:drop-shadow-lg'
                            onClick={openInviteDialog}
                        >
                            <span>Add Player</span>
                            <span className='ml-2'>+</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
