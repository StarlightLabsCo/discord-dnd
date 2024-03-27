import { useEffect } from "react";
import { useGameStore } from "@/game";
import startupSound from "@/assets/startup.mp3";
import logo from "@/assets/fantasyforgelogo.png";

export function Lobby() {
    const connectedPlayers = useGameStore((state) => state.connectedPlayers);

    useEffect(() => {
        const audio = new Audio(startupSound);
        audio.play();
    }, []);

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
                <div className='flex flex-col items-center w-1/2'>
                    {connectedPlayers.map((user, index) => (
                        <div
                            key={index}
                            className='flex items-center w-full h-12 max-w-md mb-4 text-white bg-gray-700 rounded-lg'
                        >
                            <img
                                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                className='w-32 h-32 rounded-full'
                                alt='User Avatar'
                            />
                            {user.global_name ? (
                                user.global_name
                            ) : (
                                <div className='flex items-center'>
                                    <span>Add Player</span>
                                    <span className='ml-2'>+</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
