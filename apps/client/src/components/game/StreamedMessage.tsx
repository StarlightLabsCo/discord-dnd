import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/game";
import { cn } from "@/lib/tailwind/utils";
import { useAudioStore } from "@/lib/game/audio";
import { AudioWordTimings } from "starlight-api-types/websocket";

type StreamedMessageProps = {
    text: string;
};

export const StreamedMessage = ({ text }: StreamedMessageProps) => {
    const words = text.split(" ");
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    const frameRef = useRef<number | null>(null);

    const streamedWordTimings =
        useGameStore.getState().gameState?.streamedMessageWordTimings;

    useEffect(() => {
        if (!streamedWordTimings || frameRef.current) {
            return;
        }

        frameRef.current = requestAnimationFrame(animate);
    }, [streamedWordTimings]);

    const animate = () => {
        const streamedWordTimings =
            useGameStore.getState().gameState?.streamedMessageWordTimings;

        const startTime = useAudioStore.getState().audioStartTime;
        if (!streamedWordTimings || !startTime) return;

        const parsedWordTimings = JSON.parse(
            streamedWordTimings
        ) as AudioWordTimings;

        const elapsedTime = Date.now() - startTime.getTime();
        const wordIndex = parsedWordTimings.wordStartTimesMs.findIndex(
            (time: number) => time > elapsedTime
        );

        if (wordIndex > currentWordIndex) {
            setCurrentWordIndex(wordIndex - 1);
        }

        frameRef.current = requestAnimationFrame(animate);
    };

    return (
        <div className='text-white font-light text-[1.1vw] flex flex-wrap'>
            {words.map((word, index) => {
                if (word == " ") return null;
                else if (word == "\n") {
                    return (
                        <>
                            <br key={`streamed-message-word-${index}-0`} />
                            <br key={`streamed-message-word-${index}-1`} />
                        </>
                    );
                } else {
                    return (
                        <>
                            <span
                                key={`streamed-message-word-${index}`}
                                className={cn(
                                    "transition-opacity duration-500 inline",
                                    currentWordIndex >= index
                                        ? "opacity-100"
                                        : "opacity-0"
                                )}
                            >
                                {word}
                            </span>
                            {index < words.length - 1 && " "}
                        </>
                    );
                }
            })}
        </div>
    );
};
