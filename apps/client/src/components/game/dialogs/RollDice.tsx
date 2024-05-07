import { useGameStore } from "@/lib/game";

import { useEffect, useRef } from "react";
import { initThreeJS } from "@/lib/threejs";

export function RollDiceDialog() {
    const { gameState, setGameState } = useGameStore();
    const rollDiceDialogOpen = gameState?.rollDiceDialogOpen;
    const threeRootElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (rollDiceDialogOpen && threeRootElement.current) {
            initThreeJS(threeRootElement);
        }
    }, [rollDiceDialogOpen, threeRootElement]);

    const openDialog = () => {
        if (gameState) {
            setGameState({ ...gameState, rollDiceDialogOpen: true });
        }
    };

    return (
        <>
            <button
                className='fixed bottom-2 right-2 text-white z-20'
                onClick={openDialog}
            >
                Open Dialog
            </button>

            {rollDiceDialogOpen && (
                <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-[#01131D] border-[0.1vw] border-white p-[0.1vw] rounded-2xl shadow-xl relative w-[20%] h-2/5'>
                        <button
                            className='absolute -top-6 -right-6 text-[#A5A5A5] cursor-pointer w-[1.5vw] h-[1.5vw]'
                            onClick={() =>
                                setGameState({
                                    ...gameState,
                                    rollDiceDialogOpen: false,
                                })
                            }
                        >
                            X
                        </button>
                        <div
                            className='h-full w-full'
                            ref={threeRootElement}
                        ></div>
                    </div>
                </div>
            )}
        </>
    );
}
