import React, { useState } from "react";
import { Icons } from "@/components/Icons";
import { cn, pluralize } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

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

export const DataPreview = ({ item, dataType, className }: Props) => {
    const [isNavigateDialogOpen, setIsNavigateDialogOpen] = useState(false);
    const router = useRouter();

    const handleNavigate = () => {
        router.push(`/${pluralize(dataType)}?id=${item.id}`);
    };

    return (
        <>
            <div
                className={cn(
                    "flex relative flex-col items-center cursor-pointer group max-w-[240px]",
                    className
                )}
                onClick={() => setIsNavigateDialogOpen(true)}
            >
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className='object-cover w-full h-full rounded-lg'
                />
                <div className='absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent rounded-b-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                <div className='absolute bottom-1 left-2 w-full text-sm font-light text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    {item.name}
                </div>
                <Icons.arrowTopRightOnSquare className='absolute top-1 right-1 z-10 w-6 h-6 text-white opacity-0 transition-opacity duration-300 cursor-pointer group-hover:opacity-100' />
            </div>
            <Dialog
                open={isNavigateDialogOpen}
                onOpenChange={setIsNavigateDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Navigation Confirmation</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to navigate to this page?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button
                            className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700'
                            onClick={handleNavigate}
                        >
                            Yes, navigate
                        </button>
                        <button
                            className='px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-700'
                            onClick={() => setIsNavigateDialogOpen(false)}
                        >
                            Cancel
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
