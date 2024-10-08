import { useEffect } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useGameStore } from "@/lib/game";
import { LobbyCharacterPortrait } from "@/components/lobby/LobbyCharacterPortrait";
import { AddPlayerButton } from "@/components/lobby/AddPlayerButton";
import { useMusicStore } from "@/lib/game/audio/music";
import { s3UrlRewriter } from "@/lib/discord/utils";
import { useWebsocketStore } from "@/lib/websocket";
import readySound from "@/assets/sfx/lobby/ready.mp3";

export const Route = createFileRoute("/lobby/")({
    component: Lobby,
});

function Lobby() {
    const user = useGameStore((state) => state.user);

    const connectedPlayers = useGameStore(
        (state) => state.gameState?.connectedPlayers || []
    );

    const title = useGameStore(
        (state) => state.gameState?.selectedCampaignInstance?.name
    );
    const description = useGameStore(
        (state) => state.gameState?.selectedCampaignInstance?.description
    );
    const campaignCover = useGameStore(
        (state) => state.gameState?.selectedCampaignInstance?.imageUrl
    );

    const instanceState = useGameStore((state) => state.gameState);

    useEffect(() => {
        if (!instanceState) return;
    }, [instanceState]);

    const play = useMusicStore((state) => state.play);

    useEffect(() => {
        play();
    }, [play]);

    function toggleReady() {
        if (!user) return;

        const readySfx = new Audio(readySound);

        const currentState = useGameStore.getState().gameState;
        if (!currentState || !currentState.connectedPlayers) return;

        const currentPlayer = currentState.connectedPlayers.find(
            (p) => p.user.id === user.id
        );
        if (!currentPlayer || !currentPlayer.character) return;

        const newStatus =
            currentPlayer.status === "READY" ? "NOT_READY" : "READY";
        currentPlayer.status = newStatus;

        useGameStore.setState({
            gameState: {
                ...currentState,
                connectedPlayers: currentState.connectedPlayers.map((player) =>
                    player.user.id === user.id
                        ? { ...player, status: newStatus }
                        : player
                ),
            },
        });

        readySfx.play();

        const message = JSON.stringify({
            type: "LobbyReadyRequest",
            data: { ready: newStatus === "READY" },
        });

        const ws = useWebsocketStore.getState().ws;
        if (ws) {
            ws.send(message);
        }
    }

    if (!user) return null; // Invalid state

    return (
        <div className={"w-screen h-screen"}>
            <div className='flex w-full h-full'>
                <div className='flex relative flex-col justify-end p-[2vw] w-1/2'>
                    <div className='absolute left-0  bottom-0 z-10 w-full h-[40%] bg-gradient-to-t from-black/50 to-transparent' />
                    <div className='absolute left-0 top-0 z-10 w-full h-[40%] bg-gradient-to-b from-black/50 to-transparent' />
                    <img
                        src={s3UrlRewriter(campaignCover || "")}
                        className='object-cover absolute inset-0 w-full h-full'
                        alt='Campaign Cover'
                    />
                    <div className='flex z-20 flex-col gap-y-[1vw]'>
                        <div className='font-sans text-[3.5vw] leading-none font-bold text-white drop-shadow-xl max-w-[85%]'>
                            {title}
                        </div>
                        <div className='font-sans text-[1.2vw] text-neutral-200 drop-shadow-xl max-w-[80%]'>
                            {description &&
                                description.split(" ").slice(0, 20).join(" ") +
                                    (description.split(" ").length > 20
                                        ? "..."
                                        : "")}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-between p-[1vw] w-1/2'>
                    <div />
                    <div className='grid grid-cols-3 gap-[2vw] place-items-center w-full'>
                        {connectedPlayers.map((connectedPlayer) => {
                            return (
                                <LobbyCharacterPortrait
                                    key={connectedPlayer.user.id}
                                    user={connectedPlayer.user}
                                    character={connectedPlayer.character}
                                    isCurrentUser={
                                        connectedPlayer.user.id === user.id
                                    }
                                    ready={connectedPlayer.status === "READY"}
                                />
                            );
                        })}
                        {connectedPlayers.length < 6 && <AddPlayerButton />}
                    </div>
                    <div className='flex justify-end items-center w-full'>
                        {connectedPlayers.find((p) => p.user.id === user.id)
                            ?.character ? (
                            <div
                                className='text-[3.5vw] font-bold text-white drop-shadow-xl cursor-pointer hover:scale-105'
                                onClick={toggleReady}
                            >
                                {connectedPlayers.find(
                                    (p) => p.user.id === user.id
                                )?.status === "READY"
                                    ? "Unready"
                                    : "Ready"}
                            </div>
                        ) : (
                            <Link
                                to='/lobby/character/origin'
                                className='text-[3.5vw] font-bold text-white drop-shadow-xl cursor-pointer hover:scale-105'
                            >
                                Create Character
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
