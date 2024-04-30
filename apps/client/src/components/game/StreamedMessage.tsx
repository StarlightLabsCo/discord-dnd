import { useEffect, useState } from "react";
import { useAudioStore } from "@/lib/game/audio";
import { cn } from "@/lib/tailwind/utils";

type StreamedMessageProps = {
    text: string;
};

export const StreamedMessage = ({ text }: StreamedMessageProps) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    useEffect(() => {
        let frameId: number;
        const updateWordIndex = () => {
            const { streamedMessageWordTimings, audioStartTime } =
                useAudioStore.getState();

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
        <>
            {words.map((word, index) => {
                if (word == "\n") {
                    return <br key={`streamed-message-word-${index}`} />;
                } else {
                    <span
                        key={`streamed-message-word-${index}`}
                        className={cn(
                            "transition-opacity duration-200",
                            currentWordIndex >= index
                                ? "opacity-100"
                                : "opacity-0"
                        )}
                    >
                        {word}
                    </span>;
                }
            })}
        </>
    );
};
