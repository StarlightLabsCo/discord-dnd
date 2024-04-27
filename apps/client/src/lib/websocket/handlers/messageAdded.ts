import { useGameStore } from "@/lib/game";
import { MessageAddedResponse } from "starlight-api-types/websocket";

export async function handleMessageAddedResponse(
    response: MessageAddedResponse
) {
    const { state, setState } = useGameStore.getState();
    if (!state) return;

    if (state.selectedCampaign) {
        const message = response.data;
        const updatedMessages = [...state.selectedCampaign.messages, message];
        setState({
            ...state,
            selectedCampaign: {
                ...state.selectedCampaign,
                messages: updatedMessages,
            },
        });
    }
}
