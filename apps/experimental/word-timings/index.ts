import { timings } from "./data";

type AudioCharacterTimings = {
    chars: string[];
    charStartTimesMs: number[];
    charDurationsMs: number[];
};

type AudioWordTimings = {
    words: string[];
    wordStartTimesMs: number[];
    wordDurationsMs: number[];
};

function charToWordTimings(charTimings: AudioCharacterTimings) {
    let words: string[] = [];
    let wordStartTimesMs: number[] = [];
    let wordDurationsMs: number[] = [];

    let wordIndex = 0;
    let wordStartTime = charTimings.charStartTimesMs[0];
    let wordDuration = 0;

    const isDelimiter = (char: string) =>
        [" ", ",", ".", "!", "?", ";", ":"].includes(char);

    charTimings.chars.forEach((char: string, i: number) => {
        if (isDelimiter(char)) {
            if (wordIndex < i) {
                let word = charTimings.chars.slice(wordIndex, i).join("");
                words.push(word);
                wordStartTimesMs.push(wordStartTime!);
                wordDurationsMs.push(wordDuration);
            }

            wordIndex = i + 1;
            if (i + 1 < charTimings.charStartTimesMs.length) {
                wordStartTime = charTimings.charStartTimesMs[i + 1];
            }
            wordDuration = 0;
        } else {
            wordDuration += charTimings.charDurationsMs[i]!;
        }
    });

    if (wordIndex < charTimings.chars.length) {
        let word = charTimings.chars.slice(wordIndex).join("");
        if (word !== "") {
            words.push(word);
            wordStartTimesMs.push(wordStartTime!);
            wordDurationsMs.push(wordDuration);
        }
    }

    const audioWordTimings: AudioWordTimings = {
        words,
        wordStartTimesMs,
        wordDurationsMs,
    };

    return audioWordTimings;
}

function applyOffsetToTimings(
    priorAudioWordTimings: AudioWordTimings,
    newAudioWordTimings: AudioWordTimings
): AudioWordTimings {
    const lastWordStartTimeMs =
        priorAudioWordTimings.wordStartTimesMs[
            priorAudioWordTimings.wordStartTimesMs.length - 1
        ]; // The bug here is I offset by the end of the last word, but this is not the correct offset. The correct offset is the end of the last char timing

    const lastWordDurationMs =
        priorAudioWordTimings.wordDurationsMs[
            priorAudioWordTimings.wordDurationsMs.length - 1
        ];

    const offset = lastWordStartTimeMs! + lastWordDurationMs!;

    const adjustedWordStartTimesMs = newAudioWordTimings.wordStartTimesMs.map(
        (time) => time + offset
    );

    const combinedWordTimings: AudioWordTimings = {
        words: [...priorAudioWordTimings.words, ...newAudioWordTimings.words],
        wordStartTimesMs: [
            ...priorAudioWordTimings.wordStartTimesMs,
            ...adjustedWordStartTimesMs,
        ],
        wordDurationsMs: [
            ...priorAudioWordTimings.wordDurationsMs,
            ...newAudioWordTimings.wordDurationsMs,
        ],
    };

    return combinedWordTimings;
}

function main() {
    const timingArray = timings as AudioCharacterTimings[];
    const firstTiming = timingArray[0] as AudioCharacterTimings;
    const firstWordTimings = charToWordTimings(firstTiming);

    const secondTiming = timingArray[1] as AudioCharacterTimings;
    const secondWordTimings = charToWordTimings(secondTiming);

    const combinedWordTimings = applyOffsetToTimings(
        firstWordTimings,
        secondWordTimings
    );

    console.log(`First character timings:`);
    console.log(firstTiming);
    console.log(`Second character timings:`);
    console.log(secondTiming);

    console.log(`---`);

    console.log(`First word timings:`);
    console.log(firstWordTimings);
    console.log(`Second word timings:`);
    console.log(secondWordTimings);

    const isWordCountCorrect =
        firstWordTimings.words.length + secondWordTimings.words.length ===
        combinedWordTimings.words.length;
    console.log(`Word count check: ${isWordCountCorrect}`);
}

main();
