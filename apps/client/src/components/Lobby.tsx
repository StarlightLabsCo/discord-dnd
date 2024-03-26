import logo from "@/assets/logo.png";

const connectedUsers = [
    { name: "Player 1" },
    { name: "Player 2" },
    {},
    {},
    {},
    {},
];

export function Lobby() {
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
                    {connectedUsers.map((user, index) => (
                        <div
                            key={index}
                            className='flex items-center justify-center w-full h-12 max-w-md mb-4 text-white bg-gray-700 rounded-lg'
                        >
                            {user.name ? (
                                user.name
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
