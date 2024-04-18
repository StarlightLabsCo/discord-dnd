import React from "react";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

type Item = {
    id: string;
    name: string;
    imageUrl: string;
};

type Props = {
    item: Item;
    dataType: string;
    className?: string;
};

export const ForeignKeyPreview = ({ item, dataType, className }: Props) => {
    return (
        <div
            className={cn(
                "flex relative flex-col items-center cursor-pointer",
                className
            )}
            onClick={() => window.open(`/${dataType}/${item.id}`, "_blank")}
        >
            <img
                src={item.imageUrl}
                alt={item.name}
                className='object-cover w-full h-24 rounded-lg'
            />
            <div className='absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent rounded-b-lg' />
            <div className='absolute bottom-1 left-2 w-full text-sm font-light text-white'>
                {item.name}
            </div>
            <Icons.arrowTopRightOnSquare className='absolute top-1 right-1 z-10 w-6 h-6 text-white transition cursor-pointer hover:scale-110' />
        </div>
    );
};
