import { useEffect, useState } from "react";
import { useAudioStore } from "@/lib/game/audio";
import { cn } from "@/lib/tailwind/utils";
import { useGameStore } from "@/lib/game";

type StreamedMessageProps = {
    text: string;
};

export const StreamedMessage = ({ text }: StreamedMessageProps) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    console.log(`[StreamedMessage] currentWordIndex: ${currentWordIndex}`);

    const streamedMessageId =
        useGameStore.getState().gameState?.streamedMessageId;

    useEffect(() => {
        let frameId: number;
        const updateWordIndex = () => {
            console.log(`[StreamedMessage] updateWordIndex`);
            const gameState = useGameStore.getState().gameState;
            if (!gameState) return;
            console.log(`[StreamedMessage] gameState is not null`);

            const { streamedMessageWordTimings } = gameState;
            if (!streamedMessageWordTimings) return;
            console.log(
                `[StreamedMessage] streamedMessageWordTimings is not null` // <-- This line never gets logged
            );

            const { audioStartTime } = useAudioStore.getState();
            if (!audioStartTime) return;
            console.log(`[StreamedMessage] audioStartTime is not null`);

            if (streamedMessageWordTimings && audioStartTime) {
                const elapsedTime = Date.now() - audioStartTime.getTime();
                console.log(`[StreamedMessage] elapsedTime: ${elapsedTime}`);

                const newWordIndex =
                    streamedMessageWordTimings.wordStartTimesMs.findIndex(
                        (time) => time > elapsedTime
                    );
                console.log(`[StreamedMessage] newWordIndex: ${newWordIndex}`);
                setCurrentWordIndex(newWordIndex - 1);
            }
            frameId = requestAnimationFrame(updateWordIndex);
        };

        updateWordIndex();

        return () => {
            console.log(`[StreamedMessage] cancelAnimationFrame`);
            cancelAnimationFrame(frameId);
        };
    }, [streamedMessageId]);

    const words = text.split(" ");
    return (
        <div className='flex flex-wrap'>
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
