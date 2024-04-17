"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { DeleteDialog } from "@/components/DeleteDialog";

type Props = {
    id: string;
    dataType: string;
    metadata: {
        name: string;
        description: string;
        imageUrl: string;
    };
    onDelete: () => void;
    className?: string;
};

export function GenericCard({
    id,
    dataType,
    metadata,
    onDelete,
    className,
}: Props) {
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogTrigger asChild>
                <Card
                    className={cn(
                        "w-48 h-48 rounded-lg cursor-pointer hover:scale-[102%]",
                        className
                    )}
                >
                    <img
                        src={metadata.imageUrl}
                        alt={metadata.name}
                        className='object-cover w-full h-36 rounded-t-lg'
                    />
                    <div className='p-1 text-sm'>{metadata.name}</div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{metadata.name}</DialogTitle>
                    <DialogDescription>
                        {metadata.description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <button
                        className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700'
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        Delete
                    </button>
                </DialogFooter>
            </DialogContent>
            <DeleteDialog
                itemId={id}
                itemName={metadata.name}
                endpoint={`/api/${dataType}`}
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDelete={onDelete}
            />
        </Dialog>
    );
}
