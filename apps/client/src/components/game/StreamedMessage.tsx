import { useEffect, useState } from "react";
import { useAudioStore } from "@/lib/game/audio";
import { cn } from "@/lib/tailwind/utils";
import { useGameStore } from "@/lib/game";

type StreamedMessageProps = {
    text: string;
};

export const StreamedMessage = ({ text }: StreamedMessageProps) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    console.log(`currentWordIndex: ${currentWordIndex}`);

    useEffect(() => {
        console.log(`useEffect`);
        let frameId: number;
        const updateWordIndex = () => {
            console.log(`updateWordIndex`);
            const gameState = useGameStore.getState().gameState;
            if (!gameState) return;
            console.log(`gameState is not null`);

            const { streamedMessageWordTimings } = gameState;
            if (!streamedMessageWordTimings) return;
            console.log(`streamedMessageWordTimings is not null`);

            const { audioStartTime } = useAudioStore.getState();
            if (!audioStartTime) return;
            console.log(`audioStartTime is not null`);

            if (streamedMessageWordTimings && audioStartTime) {
                const elapsedTime = Date.now() - audioStartTime.getTime();
                console.log(`elapsedTime: ${elapsedTime}`);

                const newWordIndex =
                    streamedMessageWordTimings.wordStartTimesMs.findIndex(
                        (time) => time > elapsedTime
                    );
                console.log(`newWordIndex: ${newWordIndex}`);
                setCurrentWordIndex(newWordIndex - 1);
            }
            frameId = requestAnimationFrame(updateWordIndex);
        };

        updateWordIndex();

        return () => {
            console.log(`cancelAnimationFrame`);
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
