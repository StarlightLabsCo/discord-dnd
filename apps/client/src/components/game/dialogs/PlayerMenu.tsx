import { useGameStore } from "@/lib/game";
import { CharacterInstance } from "database";

type PlayerMenuProps = {
    characterInstance: CharacterInstance;
};

export function PlayerMenu({ characterInstance }: PlayerMenuProps) {
    const { playerMenuDialogOpen, setPlayerMenuDialogOpen } = useGameStore();

    if (!playerMenuDialogOpen) return null;

    const handleClose = () => {
        setPlayerMenuDialogOpen(false);
    };

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-8 rounded-lg shadow-xl relative'>
                <button
                    className='absolute top-2 right-2 text-black text-xl'
                    onClick={handleClose}
                >
                    ×
                </button>
                {/* Content of the player menu dialog box can be added here */}
                <p>Player Menu Content!</p>
                {characterInstance.name}
            </div>
        </div>
    );
}
