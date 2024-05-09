import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "..";
import type { RollDiceRequest } from "starlight-api-types/websocket";
import { getInstanceState, updateInstanceState } from "../instanceState";
import { sendWsError } from "../utils";
import { continueStory } from "@/core/continueStory";
import { db } from "@/lib/db";

export async function handleRollDiceRequest(
    ws: ServerWebSocket<WebSocketData>,
    request: RollDiceRequest
) {
    // Get instance state
    const { user, instanceId } = ws.data;
    const { instanceState, release } = await getInstanceState(instanceId);
    if (!instanceState) {
        release();
        sendWsError(ws, `Instance state not found for ID: ${instanceId}`);
        return;
    }

    // Get RollDiceInfo from instance state
    const rollDiceInfo = instanceState.rollDiceInfo;
    const characterInstance =
        instanceState.selectedCampaignInstance.characterInstances.find(
            (characterInstance) => characterInstance.userId === user.id
        );
    if (!characterInstance) {
        release();
        sendWsError(
            ws,
            `Character Instance not found during roll dice request`
        );
        return;
    }

    // Trigger roll dice
    if (
        rollDiceInfo &&
        rollDiceInfo.state === "ready"
        //  && rollDiceInfo.characterInstanceId === characterInstance.id
    ) {
        rollDiceInfo.state = "rolling";
        updateInstanceState(instanceId, instanceState, release);

        setTimeout(async () => {
            const { instanceState, release } =
                await getInstanceState(instanceId);
            if (!instanceState) {
                release();
                sendWsError(
                    ws,
                    `Instance state not found for ID: ${instanceId}`
                );
                return;
            }

            const rollDiceInfo = instanceState.rollDiceInfo;
            if (!rollDiceInfo) {
                release();
                sendWsError(
                    ws,
                    `Roll dice info not found for ID: ${instanceId}`
                );
                return;
            }

            rollDiceInfo.state = "complete";
            // rollDiceInfo.result = Math.floor(Math.random() * 20) + 1;
            rollDiceInfo.result = 20; // For testing purposes

            const newMessage = await db.message.create({
                data: {
                    content: JSON.stringify({
                        role: "tool",
                        content: `${characterInstance.name} rolled a ${rollDiceInfo.result} on the DC ${rollDiceInfo.difficulty} ${rollDiceInfo.check} check. Result: ${rollDiceInfo.result === 1 ? "Critically Failed" : rollDiceInfo.result === 20 ? "Critically Succeeded" : rollDiceInfo.result > rollDiceInfo.difficulty ? "Succeeded" : "Failed"}.`,
                        tool_call_id: rollDiceInfo.toolCallId,
                    }),
                    instance: {
                        connect: {
                            id: instanceState.selectedCampaignInstance.id,
                        },
                    },
                },
                include: {
                    characterInstance: true,
                },
            });

            instanceState.selectedCampaignInstance.messages.push(newMessage);
            updateInstanceState(instanceId, instanceState, release);
        }, 1500);

        if (rollDiceInfo.result === 20) {
            setTimeout(async () => {
                continueStory(instanceId);
            }, 11000);
        } else {
            setTimeout(async () => {
                continueStory(instanceId);
            }, 3000);
        }
    } else {
        release();
        sendWsError(ws, `Invalid roll dice request`);
        return;
    }
}
