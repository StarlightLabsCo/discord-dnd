import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "@/lib/game";
import fantasyforgelogo from "@/assets/images/logos/fantasyforgelogo.png";
import starlightlabslogo from "@/assets/images/logos/starlightlabslogo.png";

export function LoadingScreen() {
    const user = useGameStore((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user != null) {
            navigate("/lobby", { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className='w-screen h-screen bg-gradient-to-t from-[#01131D] to-[#172737] flex justify-center items-center'>
            <img
                src={fantasyforgelogo}
                className='object-contain h-3/4 aspect-square'
                alt='Fantasy Forge Logo'
            />
            <img
                src={starlightlabslogo}
                className='absolute right-2 bottom-2 h-[3%]'
                alt='Starlight Labs Logo'
            />
        </div>
    );
}
