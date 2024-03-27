import discordSdk from "@/discord";

export function AddPlayerButton() {
    return (
        <div
            className='flex items-center justify-center w-48 h-48 text-white border border-white border-dashed cursor-pointer hover:scale-105 hover:drop-shadow-lg'
            onClick={() => discordSdk.commands.openInviteDialog()}
        >
            <span>Add Player</span>
            <span className='ml-2'>+</span>
        </div>
    );
}
