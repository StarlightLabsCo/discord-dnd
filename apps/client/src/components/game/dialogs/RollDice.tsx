import { useGameStore } from "@/lib/game";

import { useEffect, useRef, useState } from "react";
import { initThreeJS } from "@/lib/threejs";

export function RollDiceDialog() {
    const { user, gameState, setGameState } = useGameStore();
    const characterInstance =
        gameState?.selectedCampaignInstance.characterInstances.find(
            (ci) => ci.userId === user?.id
        );

    const rollingCharacter =
        gameState?.selectedCampaignInstance.characterInstances.find(
            (ci) => ci.id === gameState?.rollDiceInfo?.characterInstanceId
        );

    const rollDiceInfo = gameState?.rollDiceInfo;
    const threeRootElement = useRef<HTMLDivElement>(null);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (
            rollDiceInfo &&
            rollDiceInfo.state == "ready" &&
            threeRootElement.current
        ) {
            initThreeJS(threeRootElement);
        }
    }, [rollDiceInfo, threeRootElement]);

    useEffect(() => {
        if (rollDiceInfo && rollDiceInfo.state == "complete") {
            console.log(`Roll Dice Result: ${rollDiceInfo.result}`);
            setTimeout(() => {
                setShowResult(true);
            }, 500);

            if (rollDiceInfo.result == 20) {
                setTimeout(() => {
                    setShowResult(false);
                    setGameState({
                        ...gameState,
                        rollDiceInfo: null,
                    });
                }, 8000);
            } else {
                setTimeout(() => {
                    setShowResult(false);
                    setGameState({
                        ...gameState,
                        rollDiceInfo: null,
                    });
                }, 3000);
            }
        }
    }, [rollDiceInfo, setGameState, gameState]);

    return (
        <>
            {rollDiceInfo && (
                <div className='fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur flex flex-col items-center justify-center gap-y-[1vh]'>
                    <div className='flex flex-col items-center text-white gap-y-[1vh] w-[16vw]'>
                        <div className='flex flex-col items-center'>
                            <div className='font-bold text-[2vw]'>
                                {rollDiceInfo.check}
                            </div>
                            <div className='font-light text-[1vw]'>
                                {rollDiceInfo.subCheck} Check
                            </div>
                        </div>
                        <div className='w-full  flex justify-between items-center'>
                            <div className='w-1 h-1 bg-white rotate-45'></div>
                            <div className='h-[1px] w-full bg-white'></div>
                            <div className='w-1 h-1 bg-white rotate-45'></div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <div className='font-light text-[0.8vw]'>
                                Difficulty Class
                            </div>
                            <div className='font-bold text-[1vw]'>
                                {rollDiceInfo.difficulty}
                            </div>
                        </div>
                    </div>
                    <div className='bg-[#01131D] border-[0.1vw] border-white p-[0.1vw] rounded-2xl shadow-xl relative w-[20%] h-2/5'>
                        <div className='h-full w-full' ref={threeRootElement} />
                    </div>
                    <div className='text-[#A5A5A5] font-light text-[0.8vw] text-center'>
                        {gameState &&
                            (rollingCharacter?.id === characterInstance?.id
                                ? "You are rolling..."
                                : `${rollingCharacter?.name} is rolling...`)}
                    </div>
                    {showResult &&
                        rollDiceInfo.state === "complete" &&
                        (rollDiceInfo.result &&
                        rollDiceInfo.result > rollDiceInfo.difficulty ? (
                            <div className='absolute text-[8vw] font-bold z-10 text-[#ffbf00]'>
                                {rollDiceInfo.result == 20
                                    ? "CRITICAL SUCCESS"
                                    : "SUCCESS"}
                            </div>
                        ) : (
                            <div className='absolute text-[8vw] font-bold z-10 text-red-600'>
                                {rollDiceInfo.result == 1
                                    ? "CRITICAL FAILURE"
                                    : "FAILURE"}
                            </div>
                        ))}
                </div>
            )}
        </>
    );
}
