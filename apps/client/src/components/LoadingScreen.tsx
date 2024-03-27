import fantasyforgelogo from "@/assets/fantasyforgelogo.png";
import starlightlabslogo from "@/assets/starlightlabslogo.png";
import { cn } from "@/lib/utils";

type LoadingScreenProps = {
    className?: string;
};

export function LoadingScreen({ className }: LoadingScreenProps) {
    return (
        <div
            className={cn(
                "w-screen h-screen bg-gradient-to-t from-[#01131D] to-[#172737] flex justify-center items-center",
                className
            )}
        >
            <img
                src={fantasyforgelogo}
                className='w-[768px] h-[768px]'
                alt='Fantasy Forge Logo'
            />
            <img
                src={starlightlabslogo}
                className='absolute bottom-2 right-2 h-[25px]'
                alt='Starlight Labs Logo'
            />
        </div>
    );
}
