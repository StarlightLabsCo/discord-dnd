import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/game";
import { cn } from "@/lib/tailwind/utils";
import { useAudioStore } from "@/lib/game/audio";
import { AudioWordTimings } from "starlight-api-types/websocket";
import React from "react";
import { Message } from "database";
import { s3UrlRewriter } from "@/lib/discord/utils";

const placeholderDMImage = "https://r2.starlightlabs.co/dm.webp";

type DMStreamedMessageProps = {
    message: Message;
    className?: string;
};

export const DMStreamedMessage = ({
    message,
    className,
}: DMStreamedMessageProps) => {
    const parsedMessage = JSON.parse(message.content);
    const text = parsedMessage.content;
    const words = text
        .replaceAll("\n\n", "\n") // Eleven Labs collapses double newlines into 1 pause in audio - so need to account for that
        .split(/(\s|[,.!?;:])/)
        .filter((word: string) => word.length > 0);

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
            setCurrentWordIndex(wordIndex); // normally this would be wordIndex - 1, but 11 labs adds a space in the beginning of the words.
        }

        frameRef.current = requestAnimationFrame(animate);
    };

    return (
        <div className={cn("flex gap-x-[1.5vw]", className)}>
            <div className='shrink-0'>
                <img
                    src={s3UrlRewriter(placeholderDMImage)}
                    className='rounded-full w-[3vw] h-[3vw] object-cover'
                />
            </div>
            <div className='text-white font-light text-[1.1vw] flex flex-col gap-y-[2vh] max-w-full'>
                <div className='text-white font-light text-[1.1vw] max-w-full'>
                    {words.map((word: string, index: number) => {
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
            </div>
        </div>
    );
};
