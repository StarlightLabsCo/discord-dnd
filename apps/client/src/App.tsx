import { useEffect } from "react";
import discordSdk, { setup } from "./discord";

function App() {
    useEffect(() => {
        setup();
    }, []);

    return <div className='text-lg font-bold'>Hello World!</div>;
}

export default App;
