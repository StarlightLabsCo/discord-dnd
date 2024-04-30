import { useEffect, useState } from "react";
import { useAudioStore } from "@/lib/game/audio";

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
                console.log(`Audio start time: ${audioStartTime}`);
                console.log(`Type of audioStartTime: ${typeof audioStartTime}`);
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
