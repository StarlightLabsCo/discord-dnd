import { useGameStore } from "@/lib/game";
import { GameCharacterPortrait } from "./GameCharacterPortrait";

export function PartyDisplay() {
    const partyMembers =
        useGameStore().gameState?.selectedCampaignInstance?.characterInstances;

    return (
        <div className='flex flex-col gap-y-[2vh]'>
            {partyMembers?.map((characterInstance) => (
                <GameCharacterPortrait
                    key={characterInstance.id}
                    user={characterInstance.user}
                    characterInstance={characterInstance}
                />
            ))}
        </div>
    );
}
