import { useGameStore } from "@/lib/game";
import { GameCharacterPortrait } from "./GameCharacterPortrait";

export function PartyDisplay() {
    const user = useGameStore().user;
    const partyMembers =
        useGameStore().gameState?.selectedCampaignInstance?.characterInstances;

    return (
        <div className='flex flex-col gap-y-[2vh]'>
            {partyMembers?.map((characterInstance) => (
                <GameCharacterPortrait
                    key={characterInstance.id}
                    user={characterInstance.user}
                    characterInstance={characterInstance}
                    isCurrentUser={user?.id === characterInstance.user?.id}
                />
            ))}
        </div>
    );
}
