import { characters } from "@/assets/images/portaits";
import { useState } from "react";

export function Origin() {
    const [selected, setSelected] = useState(0);

    return (
        <div className='grid grid-cols-3 gap-4 w-[80%]'>
            {[...Array(6)].map((_, index) => (
                <div key={index} className='flex flex-col items-center'>
                    <div
                        className={`relative rounded-xl cursor-pointer ${selected === index ? "border border-yellow-600" : "border border-white"} hover:scale-105 group`}
                        onClick={() => setSelected(index)}
                    >
                        {selected !== index && (
                            <div className='absolute inset-0 w-full h-full bg-black/50 group-hover:bg-transparent' />
                        )}
                        <img
                            src={characters[index]}
                            className={`rounded-xl w-[12vw] h-[12vw]`}
                        />
                    </div>

                    <div className='mt-2'>Title {index + 1}</div>
                    <div className='text-sm font-light text-gray-500'>
                        Subtitle {index + 1}
                    </div>
                </div>
            ))}
        </div>
    );
}
