import { useEffect, useState } from "react";
import { useAudioStore } from "@/lib/game/audio";

type StreamedMessageProps = {
    text: string;
};

export const StreamedMessage = ({ text }: StreamedMessageProps) => {
    const { streamedMessageWordTimings, audioStartTime } = useAudioStore();
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    useEffect(() => {
        let frameId: number;

        const updateWordIndex = () => {
            if (streamedMessageWordTimings && audioStartTime) {
                const currentTime = Date.now();
                const startTime = audioStartTime.getTime();
                const elapsedTime = currentTime - startTime;

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
    }, [streamedMessageWordTimings, audioStartTime]);

    const lines = text.split("\n");
    const words = lines.map((line) => line.split(" "));
    const displayedLines = words.map((lineWords, lineIndex) => {
        const displayedWords = lineWords
            .slice(0, currentWordIndex + 1)
            .join(" ");
        return <div key={lineIndex}>{displayedWords}</div>;
    });

    return <>{displayedLines}</>;
};
