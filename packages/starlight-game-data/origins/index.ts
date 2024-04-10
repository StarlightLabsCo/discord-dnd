import { z } from "zod";

import { custom } from "./custom";
import { eliza } from "./eliza";
import { murac } from "./murac";

export type Origin = z.infer<typeof OriginZodSchema>;

export const OriginZodSchema = z.object({
    id: z.string(),
    title: z.string(),
    src: z.string(),
});

export const origins: Record<string, Origin> = {
    eliza,
    murac,
    custom,
};
