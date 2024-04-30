import { useEffect, useState } from "react";
import { useAudioStore } from "@/lib/game/audio";
import { cn } from "@/lib/tailwind/utils";

type StreamedMessageProps = {
    text: string;
};

export const StreamedMessage = ({ text }: StreamedMessageProps) => {
    const [currentWordIndices, setCurrentWordIndices] = useState<number[]>([]);

    useEffect(() => {
        let frameId: number;
        const updateWordIndices = () => {
            const { streamedMessageWordTimings, audioStartTime } =
                useAudioStore.getState();
            if (streamedMessageWordTimings && audioStartTime) {
                const elapsedTime = Date.now() - audioStartTime.getTime();
                const newWordIndices =
                    streamedMessageWordTimings.wordStartTimesMs
                        .map((time, index) => (elapsedTime > time ? index : -1))
                        .filter((index) => index !== -1);
                setCurrentWordIndices(newWordIndices);
            }
            frameId = requestAnimationFrame(updateWordIndices);
        };

        updateWordIndices();

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, []);

    const lines = text.split("\n");
    const words = lines.map((line) => line.split(" "));

    const displayedLines = words.map((lineWords, lineIndex) => {
        const displayedWords = lineWords.map((word, wordIndex) => {
            const isVisible = currentWordIndices.includes(wordIndex);
            const visibility = isVisible ? "opacity-100" : "opacity-0";
            return (
                <span
                    key={wordIndex}
                    className={cn(
                        "transition-opacity duration-200",
                        visibility
                    )}
                >
                    {word}{" "}
                </span>
            );
        });
        return <div key={lineIndex}>{displayedWords}</div>;
    });

    return <>{displayedLines}</>;
};
