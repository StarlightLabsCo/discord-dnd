import { useState } from "react";
import { useMusicStore } from "../../lib/game/music";
import { Icons } from "../Icons";

export function MusicControlsButton() {
    const { playing, volume, play, pause, next, prev, setVolume } =
        useMusicStore();
    const [showControls, setShowControls] = useState(false);

    const toggleVolume = () => {
        const newVolume = volume === 1 ? 0.5 : volume === 0.5 ? 0 : 1;
        setVolume(newVolume);
    };

    return (
        <div className='relative'>
            <Icons.music
                className='w-[2vw] h-[2vw] text-white cursor-pointer hover:scale-105'
                onClick={() => setShowControls(!showControls)}
            />
            {showControls && (
                <div className='absolute bottom-0 flex px-[1vw] py-[0.5vw] space-x-[0.5vw] translate-y-[20%] -translate-x-[105%] bg-[#273747] rounded-full'>
                    <Icons.prev
                        className='w-[2vw] h-[2vw] text-white cursor-pointer hover:scale-105'
                        onClick={prev}
                    />
                    {playing ? (
                        <Icons.pause
                            className='w-[2vw] h-[2vw] text-white cursor-pointer hover:scale-105'
                            onClick={pause}
                        />
                    ) : (
                        <Icons.play
                            className='w-[2vw] h-[2vw] text-white cursor-pointer hover:scale-105'
                            onClick={play}
                        />
                    )}
                    <Icons.next
                        className='w-[2vw] h-[2vw] text-white cursor-pointer hover:scale-105'
                        onClick={next}
                    />
                    {volume === 1 ? (
                        <Icons.speaker
                            className={`text-white cursor-pointer w-[2vw] h-[2vw] hover:scale-105`}
                            onClick={toggleVolume}
                        />
                    ) : volume > 0 ? (
                        <Icons.speakerHalfVolume
                            className={`text-white cursor-pointer w-[2vw] h-[2vw] hover:scale-105`}
                            onClick={toggleVolume}
                        />
                    ) : (
                        <Icons.speakerMute
                            className={`text-white cursor-pointer w-[2vw] h-[2vw] hover:scale-105`}
                            onClick={toggleVolume}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
