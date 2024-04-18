import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function pluralize(word: string): string {
    if (word.endsWith("s")) {
        return word + "es";
    } else if (word.endsWith("y")) {
        return word.slice(0, -1) + "ies";
    } else if (word.endsWith("sh") || word.endsWith("ch")) {
        return word + "es";
    } else if (word.endsWith("class")) {
        return word + "es";
    } else {
        return word + "s";
    }
}
