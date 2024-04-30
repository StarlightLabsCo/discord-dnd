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

        console.log(
            "[StreamedMessage] Word Timings Length",
            parsedWordTimings.words.length
        );
        console.log(`[StreamedMessage] words: ${words}`);

        const elapsedTime = Date.now() - startTime.getTime();
        const wordIndex = parsedWordTimings.wordStartTimesMs.findIndex(
            (time: number) => time > elapsedTime
        );

        console.log(`[StreamedMessage] Elapsed time: ${elapsedTime}`);
        console.log(`[StreamedMessage] Word index: ${wordIndex}`);

        if (wordIndex === -1) {
            console.log("[StreamedMessage] Finished streaming message");
            setCurrentWordIndex(words.length);
            cancelAnimationFrame(frameRef.current!);
            return;
        }

        setCurrentWordIndex(wordIndex - 1);

        frameRef.current = requestAnimationFrame(animate);
    };

    return (
        <div className='flex flex-wrap gap-x-[0.3vw] gap-y-[1vh]'>
            {words.map((word, index) => {
                if (word === "\n") {
                    return <br key={`streamed-message-word-${index}`} />;
                } else {
                    return (
                        <span
                            key={`streamed-message-word-${index}`}
                            className={cn(
                                "transition-opacity duration-200 inline",
                                currentWordIndex >= index
                                    ? "opacity-100"
                                    : "opacity-0"
                            )}
                        >
                            {word + " "}
                        </span>
                    );
                }
            })}
        </div>
    );
};
