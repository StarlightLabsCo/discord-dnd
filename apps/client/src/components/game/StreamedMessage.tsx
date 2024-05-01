import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/game";
import { cn } from "@/lib/tailwind/utils";
import { useAudioStore } from "@/lib/game/audio";
import { AudioWordTimings } from "starlight-api-types/websocket";
import React from "react";

type StreamedMessageProps = {
    text: string;
};

export const StreamedMessage = ({ text }: StreamedMessageProps) => {
    const words = text
        .replace("\n\n", "\n") // Eleven Labs collapses double newlines into 1 pause in audio - so need to account for that
        .split(/(\s|[,.!?;:])/)
        .filter((word) => word.length > 0);
    console.log(JSON.stringify(words));

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
        <div className='text-white font-light text-[1.1vw] max-w-full'>
            {words.map((word, index) => {
                if (word === "\n") {
                    return (
                        <React.Fragment
                            key={`streamed-message-newline-${index}`}
                        >
                            <br />
                            <br />
                        </React.Fragment>
                    );
                } else if (word.trim() === "") {
                    return (
                        <span
                            key={`streamed-message-space-${index}`}
                            className='inline'
                        >
                            {word}
                        </span>
                    );
                } else {
                    return (
                        <span
                            key={`streamed-message-word-${index}`}
                            className={cn(
                                "transition-opacity duration-[400ms] inline",
                                currentWordIndex >= index
                                    ? "opacity-100"
                                    : "opacity-0"
                            )}
                        >
                            {word}
                        </span>
                    );
                }
            })}
        </div>
    );
};
