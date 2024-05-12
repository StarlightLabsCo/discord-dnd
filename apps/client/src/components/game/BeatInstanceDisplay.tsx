import { s3UrlRewriter } from "@/lib/discord/utils";
import { useGameStore } from "@/lib/game";

export function BeatInstanceDisplay() {
    const gameStore = useGameStore();
    const selectedCampaignInstance =
        gameStore.gameState?.selectedCampaignInstance;
    const storyBeatInstances = selectedCampaignInstance?.storyBeatInstances;
    console.log(`Story beat instances: ${storyBeatInstances}`);
    if (!storyBeatInstances) {
        console.log("No story beat instances");
        return null;
    }

    const beatInstance = storyBeatInstances[storyBeatInstances.length - 1];
    console.log(`Beat instance: ${beatInstance}`);
    if (!beatInstance) {
        console.log("No beat instance");
        return null;
    }

    return (
        <div className='w-full flex flex-col'>
            <div className='w-full relative'>
                <img
                    src={s3UrlRewriter(beatInstance.imageUrl)}
                    alt={beatInstance.name}
                    className='h-[35vh] w-full object-cover'
                />
                <div className='text-white absolute top-[0.5vh] left-[0.5vh] font-bold z-10'>
                    {beatInstance.beat.location.name}
                </div>
                <div className='absolute top-0 left-0 w-full h-[10vh] bg-gradient-to-b from-[#01131D] to-transparent' />
            </div>
        </div>
    );
}
