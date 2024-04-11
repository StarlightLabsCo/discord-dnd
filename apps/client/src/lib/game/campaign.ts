import create from "zustand";

interface CampaignStoreState {
    title: string;
    setTitle: (title: string) => void;

    description: string;
    setDescription: (description: string) => void;
}

export const useCampaignStore = create<CampaignStoreState>((set) => ({
    title: "The Forbidden Tower",
    setTitle: (title) => set({ title }),

    description:
        "Ancient power awakens as a legendary tower, steeped in forbidden magic, emerges from the mists, promising untold riches and arcane knowledge to those brave enough to face its dark mysteries.",
    setDescription: (description) => set({ description }),
}));
