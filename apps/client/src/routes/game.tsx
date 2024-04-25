import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
    component: () => <GameLayout />,
});

function GameLayout() {
    return (
        <div className='flex relative items-center w-screen h-screen text-white'>
            <div className='w-1/5' />
            <div className='flex-1 max-w-[calc(80%-30vw)]'>
                <Outlet />
            </div>
        </div>
    );
}
