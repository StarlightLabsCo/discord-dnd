import { useGameStore } from "@/lib/game";

export function BeatInstanceDisplay() {
    const gameStore = useGameStore();
    const selectedCampaignInstance =
        gameStore.gameState?.selectedCampaignInstance;
    const storyBeatInstances = selectedCampaignInstance?.storyBeatInstances;
    if (!storyBeatInstances) return null;

    const beatInstance = storyBeatInstances[storyBeatInstances.length - 1];
    if (!beatInstance) return null;

    return <>{beatInstance.name}</>;
}
