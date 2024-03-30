import fantasyforgelogo from "@/assets/images/logos/fantasyforgelogo.png";
import starlightlabslogo from "@/assets/images/logos/starlightlabslogo.png";
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
