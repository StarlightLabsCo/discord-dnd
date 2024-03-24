import { useEffect } from "react";
import { setup } from "./discord";
import { useDiscordStore } from "./stores/discord-store";

function App() {
    const auth = useDiscordStore((state) => state.auth);

    useEffect(() => {
        setup();
    }, []);

    return (
        <>
            <div className='text-lg font-bold'>Hello World!</div>
            <div className='text-sm text-gray-500'>
                This is a Discord D&D app
            </div>
            <div className='text-sm text-gray-500'>
                Authenticated: {auth != null ? "True" : "False"}
            </div>
        </>
    );
}

export default App;
