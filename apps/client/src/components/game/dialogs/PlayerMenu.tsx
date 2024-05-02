import { Icons } from "@/components/Icons";
import { s3UrlRewriter } from "@/lib/discord/utils";
import { useGameStore } from "@/lib/game";
import { CharacterInstance } from "database";
import { useState } from "react";

type PlayerMenuProps = {
    characterInstance: CharacterInstance;
};

export function PlayerMenu({ characterInstance }: PlayerMenuProps) {
    const { playerMenuDialogOpen, setPlayerMenuDialogOpen } = useGameStore();
    const [columns, setColumns] = useState(6);
    const [rows, setRows] = useState(3);
    const [gap, setGap] = useState(0.2);

    if (!playerMenuDialogOpen) return null;

    const handleClose = () => {
        setPlayerMenuDialogOpen(false);
    };

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-[#01131D] border-[0.1vw] border-white  p-[1vw] rounded-2xl shadow-xl relative w-[45%] h-3/4'>
                <Icons.x
                    className='absolute -top-6 -right-6 text-[#A5A5A5] cursor-pointer w-[1.5vw] h-[1.5vw]'
                    onClick={handleClose}
                />
                <div className='flex flex-col w-full h-full'>
                    {/* Top Character Stats (Name - Level - Gold) */}
                    <div className='flex w-full justify-between items-center'>
                        <div className='text-white text-[0.8vw]'>
                            {characterInstance.name}
                        </div>
                        <div className='text-white text-[0.8vw] flex'>
                            {10}
                            <div className='text-[#A5A5A5]'>g</div>
                        </div>
                        <div className='absolute left-1/2 -translate-x-1/2 flex items-center gap-x-[0.2vw]'>
                            <div className='text-white text-[0.6vw] text-nowrap'>
                                Level {characterInstance.level}
                            </div>
                            <div className='w-[14vw] bg-[#484848] h-[0.6vh] rounded-full'>
                                <div
                                    className='bg-[#FFD700] h-full rounded-full'
                                    style={{
                                        width: `${(80 / 100) * 100}%`,
                                    }}
                                />
                            </div>
                            <div className='text-white text-[0.6vw] '>XP</div>
                        </div>
                    </div>
                    {/* Character Stats & Profile Image & Inventory */}
                    <div className='grid grid-cols-2 grid-rows-[95%_5%] py-[1vw] gap-[1vw] w-full h-full'>
                        {/* Character Stats */}
                        <div className='bg-[#040E16] rounded-xl row-span-1'>
                            Column 1, Row 1
                        </div>
                        {/* Character Image & Inventory */}
                        <div className='rounded-xl row-span-1 flex flex-col'>
                            <img
                                src={s3UrlRewriter(characterInstance.imageUrl)}
                                className='w-full aspect-square object-cover rounded-xl'
                            />
                            <div
                                className='mt-[1vw] rounded-xl h-full grid max-w-full max-h-full'
                                style={{
                                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                                    gap: `${gap}vw`,
                                }}
                            >
                                {Array.from({ length: rows * columns }).map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className='bg-[#040E16] w-full aspect-square rounded-md'
                                        ></div>
                                    )
                                )}
                            </div>
                        </div>
                        {/* Bottom Info Bar */}
                        <div className='col-span-2 row-span-1 grid grid-cols-2 grid-rows-1 gap-x-[1vw]'>
                            <div />
                            <div className='flex items-center gap-[0.4vw] w-full'>
                                <div className='text-white text-[0.7vw]'>
                                    Capacity
                                </div>
                                <div className='w-[10vw] bg-[#464646] h-[0.6vh] rounded-full grow'>
                                    <div
                                        className='bg-white h-full rounded-full'
                                        style={{
                                            width: `${(80 / 100) * 100}%`,
                                        }}
                                    />
                                </div>
                                <div className='text-white text-[0.7vw]'>
                                    {characterInstance.strength * 15} lbs
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Debug Sliders */}
                    <div className='fixed bottom-10 left-10 flex space-x-4 text-white'>
                        <div>
                            <label>Columns: {columns}</label>
                            <input
                                type='range'
                                min='1'
                                max='10'
                                value={columns}
                                onChange={(e) =>
                                    setColumns(parseInt(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <label>Rows: {rows}</label>
                            <input
                                type='range'
                                min='1'
                                max='10'
                                value={rows}
                                onChange={(e) =>
                                    setRows(parseInt(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <label>Gap: {gap}vw</label>
                            <input
                                type='range'
                                min='0'
                                max='1'
                                step='0.1'
                                value={gap}
                                onChange={(e) =>
                                    setGap(parseFloat(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
