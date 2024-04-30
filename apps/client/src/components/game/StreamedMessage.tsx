import { useEffect, useState } from "react";
import { useAudioStore } from "@/lib/game/audio";
import { cn } from "@/lib/tailwind/utils";
import { useGameStore } from "@/lib/game";

type StreamedMessageProps = {
    text: string;
};

export const StreamedMessage = ({ text }: StreamedMessageProps) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    useEffect(() => {
        let frameId: number;
        const updateWordIndex = () => {
            const gameState = useGameStore.getState().gameState;
            if (!gameState) return;

            const { streamedMessageWordTimings } = gameState;
            if (!streamedMessageWordTimings) return;

            const { audioStartTime } = useAudioStore.getState();
            if (!audioStartTime) return;

            if (streamedMessageWordTimings && audioStartTime) {
                const elapsedTime = Date.now() - audioStartTime.getTime();

                const newWordIndex =
                    streamedMessageWordTimings.wordStartTimesMs.findIndex(
                        (time) => time > elapsedTime
                    );
                setCurrentWordIndex(newWordIndex - 1);
            }
            frameId = requestAnimationFrame(updateWordIndex);
        };

        updateWordIndex();

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, []);

    const words = text.split(" ");
    return (
        <div className='flex flex-wrap w-full'>
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
