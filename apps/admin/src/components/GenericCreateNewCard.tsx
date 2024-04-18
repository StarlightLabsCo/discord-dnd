"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Icons } from "./Icons";
import { InputField, InputFieldMapper } from "./InputFieldMapper";

type Props = {
    dataType: string;
    inputFields: InputField[];
    onSuccessfulSubmit?: () => void;
    className?: string;
};

export function GenericCreateNewCard({
    dataType,
    inputFields,
    onSuccessfulSubmit,
    className,
}: Props) {
    const [formData, setFormData] = useState(
        inputFields.reduce<Record<string, any>>((acc, field) => {
            if (
                field.type === "enum" &&
                Object.keys(field.enumObject).length > 0
            ) {
                acc[field.name] = Object.keys(field.enumObject)[0];
            } else {
                acc[field.name] = "";
            }
            return acc;
        }, {})
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [createMoreToggle, setCreateMoreToggle] = useState(false);

    const formattedDataType = dataType
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^\w/, (c) => c.toUpperCase());

    const handleSubmit = async () => {
        const response = await fetch(`/api/${dataType}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            toast.error(`Failed to create ${formattedDataType}`);
        } else {
            onSuccessfulSubmit?.();
            toast.success(`${formattedDataType} created successfully`);

            setFormData(
                inputFields.reduce<Record<string, any>>((acc, field) => {
                    acc[field.name] = "";
                    return acc;
                }, {})
            );

            if (!createMoreToggle) {
                setIsDialogOpen(false);
            }
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <div
                    className={cn(
                        "flex relative justify-center items-center w-48 h-48 rounded-lg border-dashed cursor-pointer border-[1px] border-neutral-400 group",
                        className
                    )}
                >
                    <div className='absolute top-1 mx-auto text-xs font-light'>
                        New {formattedDataType}
                    </div>
                    <Icons.plus className='w-6 h-6 transition group-hover:scale-[130%]' />
                </div>
            </DialogTrigger>
            <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader className='mb-6'>
                    <DialogTitle>Create New {formattedDataType}</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new {formattedDataType}.
                    </DialogDescription>
                </DialogHeader>
                <InputFieldMapper
                    parentId={null}
                    inputFields={inputFields}
                    formData={formData}
                    setFormData={setFormData}
                />
                <DialogFooter className='flex gap-x-4 items-center'>
                    <div className='flex items-center'>
                        <Switch
                            checked={createMoreToggle}
                            onCheckedChange={setCreateMoreToggle}
                            className='mr-2'
                        />
                        <div className='text-xs font-light'>Create More</div>
                    </div>
                    <Button onClick={handleSubmit}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
