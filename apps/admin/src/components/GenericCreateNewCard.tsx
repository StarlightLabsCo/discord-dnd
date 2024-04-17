"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { InputField } from "./GenericCardDisplay";
import { GenericDataDropdown } from "./GenericDataDropdown";
import { Icons } from "./Icons";

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
            acc[field.name] = "";
            return acc;
        }, {})
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [createMoreToggle, setCreateMoreToggle] = useState(false);

    const handleSubmit = async () => {
        const response = await fetch(`/api/${dataType}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            toast.error(`Failed to create ${dataType}`);
        } else {
            onSuccessfulSubmit?.();
            toast.success(`${dataType} created successfully`);

            setFormData({
                campaignId: "",
                name: "",
                description: "",
                imageUrl: "",
            });

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
                        new {dataType}
                    </div>
                    <Icons.plus className='w-6 h-6 transition group-hover:scale-[130%]' />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className='mb-6'>
                    <DialogTitle>Create New {dataType}</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new act.
                    </DialogDescription>
                </DialogHeader>

                {inputFields.map((field: InputField) => {
                    if (field.type === "dropdown") {
                        return (
                            <div className='flex flex-col gap-y-1'>
                                <div className='text-xs font-light'>
                                    {field.label}
                                </div>
                                <GenericDataDropdown
                                    key={field.name}
                                    name={field.label}
                                    dataType={field.name.split("Id")[0]}
                                    selectedId={formData[field.name]}
                                    setSelectedId={(id) =>
                                        setFormData({
                                            ...formData,
                                            [field.name]: id,
                                        })
                                    }
                                />
                            </div>
                        );
                    } else {
                        return (
                            <div className='flex flex-col gap-y-1'>
                                <div className='text-xs font-light'>
                                    {field.label}
                                </div>
                                <Input
                                    type={field.type}
                                    value={formData[field.name]}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            [field.name]: e.target.value,
                                        })
                                    }
                                    className='mb-2'
                                />
                            </div>
                        );
                    }
                })}
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
