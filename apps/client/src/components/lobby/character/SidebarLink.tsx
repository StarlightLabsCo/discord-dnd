import { cn } from "@/lib/tailwind/utils";
import { Link } from "@tanstack/react-router";
import { AppLayoutPaths } from "@/main";

type SidebarLinkProps = {
    to: AppLayoutPaths;
    text: string;
    subtext?: string;
    active?: boolean;
    className?: string;
};

export function SidebarLink({
    to,
    text,
    subtext,
    active,
    className,
}: SidebarLinkProps) {
    return (
        <Link
            to={to}
            className={cn(
                "flex gap-x-4 items-center p-[0.5vw] rounded-[1vw] cursor-pointer hover:bg-[#1A2B3C]",
                "border border-transparent",
                active && "border-white",
                className
            )}
        >
            <div className='flex justify-center items-center w-[1.25vw] h-[1.25vw] rounded-full border border-white'>
                <div className='w-[.75vw] h-[.75vw] bg-white rounded-full' />
            </div>
            <div className='flex flex-col'>
                <div className='text-[1vw] font-bold'>{text}</div>
                {subtext && (
                    <div className='text-[1vw] font-light'>{subtext}</div>
                )}
            </div>
        </Link>
    );
}
