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

function charToWordTimings(
    charTimings: AudioCharacterTimings
): AudioWordTimings {
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
                // Add the word before the delimiter
                let word = charTimings.chars.slice(wordIndex, i).join("");
                words.push(word);
                wordStartTimesMs.push(wordStartTime!);
                wordDurationsMs.push(wordDuration);
            }
            // Add the delimiter as a separate word
            words.push(char);
            wordStartTimesMs.push(charTimings.charStartTimesMs[i]);
            wordDurationsMs.push(charTimings.charDurationsMs[i]!);

            // Reset for the next word
            wordIndex = i + 1;
            wordStartTime = charTimings.charStartTimesMs[i + 1] || 0;
            wordDuration = 0;
        } else {
            if (i === wordIndex) {
                // Start of a new word
                wordStartTime = charTimings.charStartTimesMs[i];
            }
            wordDuration += charTimings.charDurationsMs[i]!;
        }
    });

    // Add the last word if it ends at the last character
    if (wordIndex < charTimings.chars.length) {
        let word = charTimings.chars.slice(wordIndex).join("");
        words.push(word);
        wordStartTimesMs.push(wordStartTime!);
        wordDurationsMs.push(wordDuration);
    }

    const audioWordTimings: AudioWordTimings = {
        words,
        wordStartTimesMs,
        wordDurationsMs,
    };

    return audioWordTimings;
}

function applyOffsetToCharTimings(
    priorAudioCharTimings: AudioCharacterTimings,
    newAudioCharTimings: AudioCharacterTimings
) {
    const lastCharStartTimeMs =
        priorAudioCharTimings.charStartTimesMs[
            priorAudioCharTimings.charStartTimesMs.length - 1
        ] || 0;

    const lastCharDurationMs =
        priorAudioCharTimings.charDurationsMs[
            priorAudioCharTimings.charDurationsMs.length - 1
        ] || 0;

    const offset = lastCharStartTimeMs + lastCharDurationMs;

    const adjustedCharStartTimesMs = newAudioCharTimings.charStartTimesMs.map(
        (time) => time + offset
    );

    const combinedCharTimings: AudioCharacterTimings = {
        chars: [...priorAudioCharTimings.chars, ...newAudioCharTimings.chars],
        charStartTimesMs: [
            ...priorAudioCharTimings.charStartTimesMs,
            ...adjustedCharStartTimesMs,
        ],
        charDurationsMs: [
            ...priorAudioCharTimings.charDurationsMs,
            ...newAudioCharTimings.charDurationsMs,
        ],
    };

    return combinedCharTimings;
}

function main() {
    const timingArray = timings as AudioCharacterTimings[];
    const firstTiming = timingArray[0] as AudioCharacterTimings;
    const secondTiming = timingArray[1] as AudioCharacterTimings;

    console.log("First Timing:");
    console.log("--------------------");
    console.log(firstTiming);
    console.log("--------------------\n");

    console.log("Second Timing:");
    console.log("--------------------");
    console.log(secondTiming);
    console.log("--------------------\n");

    const combinedTimings = applyOffsetToCharTimings(firstTiming, secondTiming);

    console.log("Combined Character Timings:");
    console.log("--------------------");
    console.log(combinedTimings);
    console.log("--------------------\n");

    const combinedWordTimings = charToWordTimings(combinedTimings);

    console.log("Combined Word Timings:");
    console.log("--------------------");
    console.log(combinedWordTimings);
    console.log("--------------------\n");
}
main();
