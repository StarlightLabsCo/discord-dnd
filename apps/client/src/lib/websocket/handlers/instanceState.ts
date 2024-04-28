import { useGameStore } from "@/lib/game";
import { useCharacterEditorStore } from "@/lib/game/characterEditor";
import { InstanceStateResponse } from "starlight-api-types/websocket";

export async function handleInstanceStateResponse(
    response: InstanceStateResponse
) {
    useGameStore.getState().setState(response.data);

    const campaignId = response.data.selectedCampaign.campaignId;
    useCharacterEditorStore.getState().setWorldByCampaignId(campaignId);
}
