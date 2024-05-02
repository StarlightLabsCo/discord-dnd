import { useGameStore } from "@/lib/game";

export function RollDiceDialog() {
    const rollDiceDialogOpen = useGameStore().gameState?.rollDiceDialogOpen;

    if (!rollDiceDialogOpen) return null;

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-8 rounded-lg shadow-xl'>
                {/* Content of the dialog box can be added here */}
                <p>Roll the dice!</p>
            </div>
        </div>
    );
}
