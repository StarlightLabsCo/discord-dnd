"use client";

import { useState, useEffect } from "react";

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
import { InputField, InputFieldMapper } from "@/components/InputFieldMapper";

type Props = {
    id: string;
    inputFields: InputField[];
    dataType: string;
    data: any;
    onDelete: () => void;
    className?: string;
};

export function GenericCard({
    id,
    inputFields,
    dataType,
    data,
    onDelete,
    className,
}: Props) {
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const newFormData = inputFields.reduce<Record<string, any>>(
            (acc, field) => {
                acc[field.name] = data[field.name] || "";
                return acc;
            },
            {}
        );
        setFormData(newFormData);
    }, [data, inputFields]);

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
                        src={data.imageUrl}
                        alt={data.name}
                        className='object-cover w-full h-36 rounded-t-lg'
                    />
                    <div className='p-1 text-sm'>{data.name}</div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{data.name}</DialogTitle>
                    <DialogDescription>{data.description}</DialogDescription>
                </DialogHeader>
                <InputFieldMapper
                    data={data}
                    inputFields={inputFields}
                    formData={formData}
                    setFormData={setFormData}
                />
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
                itemName={data.name}
                endpoint={`/api/${dataType}`}
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDelete={onDelete}
            />
        </Dialog>
    );
}
