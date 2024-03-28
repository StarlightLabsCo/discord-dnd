import { useState } from "react";
import { useMusicStore } from "../game/music";
import { Icons } from "./Icons";

export function MusicControlsButton() {
    const { playing, volume, play, pause, next, prev, setVolume } =
        useMusicStore();
    const [showControls, setShowControls] = useState(false); // State to toggle visibility of controls

    const toggleVolume = () => {
        const newVolume = volume === 1 ? 0.5 : volume === 0.5 ? 0 : 1;
        setVolume(newVolume);
    };

    return (
        <div className='relative'>
            <Icons.music
                className='w-10 h-10 text-white cursor-pointer hover:scale-105'
                onClick={() => setShowControls(!showControls)}
            />
            {showControls && (
                <div className='absolute bottom-0 flex px-4 py-2 space-x-2 -translate-x-[105%] bg-[#273747] rounded-full'>
                    <Icons.prev
                        className='w-6 h-6 text-white cursor-pointer hover:scale-105'
                        onClick={prev}
                    />
                    {playing ? (
                        <Icons.pause
                            className='w-6 h-6 text-white cursor-pointer hover:scale-105'
                            onClick={pause}
                        />
                    ) : (
                        <Icons.play
                            className='w-6 h-6 text-white cursor-pointer hover:scale-105'
                            onClick={play}
                        />
                    )}
                    <Icons.next
                        className='w-6 h-6 text-white cursor-pointer hover:scale-105'
                        onClick={next}
                    />
                    {volume === 1 ? (
                        <Icons.speaker
                            className={`w-6 h-6 text-white cursor-pointer hover:scale-105`}
                            onClick={toggleVolume}
                        />
                    ) : volume > 0 ? (
                        <Icons.speakerHalfVolume
                            className={`w-6 h-6 text-white cursor-pointer hover:scale-105`}
                            onClick={toggleVolume}
                        />
                    ) : (
                        <Icons.speakerMute
                            className={`w-6 h-6 text-white cursor-pointer hover:scale-105`}
                            onClick={toggleVolume}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
