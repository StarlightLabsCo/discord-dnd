import { custom } from "./custom";
import { eliza } from "./eliza";
import { murac } from "./murac";

export type Origin = {
    id: string;
    title: string;
    src: string;
};

export const origins: Record<string, Origin> = {
    eliza,
    murac,
    custom,
};
