import * as debug from "./debug.json";

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

function main() {
    const timings = debug as AudioCharacterTimings;

    console.log(`Character Timings:`);
    console.log(timings);

    console.log(`Length: ${timings.chars.length} words`);
    console.log(`Length: ${timings.charStartTimesMs.length} start times`);
    console.log(`Length: ${timings.charDurationsMs.length} durations`);

    console.log(`-----------------`);

    console.log(`Word Timings:`);
    const wordTimings = charToWordTimings(timings);
    console.log(wordTimings);
    console.log(`Length: ${wordTimings.words.length} words`);
    console.log(`Length: ${wordTimings.wordStartTimesMs.length} start times`);
    console.log(`Length: ${wordTimings.wordDurationsMs.length} durations`);
}

main();
