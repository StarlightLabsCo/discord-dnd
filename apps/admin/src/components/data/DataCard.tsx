"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { Icons } from "@/components/Icons";
import {
    InputField,
    InputFieldMapper,
} from "@/components/data/InputFieldMapper";
import { Card } from "../ui/card";
import { DeleteDialog } from "./DeleteDialog";

type Props = {
    dataType: string;
    inputFields: InputField[];

    data?: any; // if data is not provided, we are in create new mode

    onSuccessfulSubmit?: () => void; // create, edit
    onDelete?: () => void;

    className?: string;
};

export function DataCard({
    dataType,
    inputFields,

    data,

    onSuccessfulSubmit,
    onDelete,

    className,
}: Props) {
    // See if the dialog should be open based on the URL (allows for direct linking)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlId = searchParams.get("id");
        if (data && urlId === data.id) {
            setIsDialogOpen(true);
        }
    }, []);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Initialize the form data
    const [formData, setFormData] = useState<Record<string, any>>(
        () =>
            data ??
            inputFields.reduce<Record<string, any>>((acc, field) => {
                acc[field.name] = "";
                return acc;
            }, {})
    );

    const formattedDataType = dataType
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^\w/, (c) => c.toUpperCase());

    // Create Mode
    const [createMoreToggle, setCreateMoreToggle] = useState(false);

    const handlePost = async () => {
        const response = await fetch(`/api/data/${dataType}`, {
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

    // View / Edit Mode
    const [editing, setEditing] = useState(data ? false : true);

    const handlePatch = async () => {
        if (!data || !onSuccessfulSubmit) return;

        const formDataDiff = Object.keys(formData).reduce<Record<string, any>>(
            (diff, key) => {
                if (String(formData[key]) !== String(data[key])) {
                    diff[key] = formData[key];
                }
                return diff;
            },
            {}
        );

        if (Object.keys(formDataDiff).length === 0) {
            toast.info("No changes to save.");
            return;
        }

        const response = await fetch(`/api/data/${dataType}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: data.id,
                ...formDataDiff,
            }),
        });

        if (!response.ok) {
            toast.error(
                `Failed to update ${formattedDataType} (${data.name}).`
            );
        } else {
            onSuccessfulSubmit();
            toast.success(
                `${formattedDataType} (${data.name}) updated successfully.`
            );
            setEditing(false);
            setIsDialogOpen(false);
        }
    };

    // Delete
    const handleDelete = async () => {
        if (!data || !onDelete) return;

        const response = await fetch(`/api/data/${dataType}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: data.id }),
        });

        setIsDeleteDialogOpen(false);
        if (response.ok) {
            toast.success(
                `${formattedDataType} (${data.name}) deleted successfully.`
            );
            onDelete();
        } else {
            toast.error(
                `Failed to delete ${formattedDataType} (${data.name}).`
            );
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {data ? (
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
                ) : (
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
                )}
            </DialogTrigger>
            <DialogContent
                {...(data
                    ? {
                          isLocked: !editing,
                          onToggleLock: () => setEditing(!editing),
                      }
                    : {})}
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                {data ? (
                    <DialogHeader>
                        <DialogTitle>{data.name}</DialogTitle>
                        <DialogDescription className='w-3/4'>
                            {data.description}
                        </DialogDescription>
                    </DialogHeader>
                ) : (
                    <DialogHeader className='mb-6'>
                        <DialogTitle>
                            Create New {formattedDataType}
                        </DialogTitle>
                        <DialogDescription>
                            Enter the details of the new {formattedDataType}.
                        </DialogDescription>
                    </DialogHeader>
                )}
                <InputFieldMapper
                    data={[]}
                    inputFields={inputFields}
                    formData={formData}
                    setFormData={setFormData}
                    disabled={!editing}
                />
                <DialogFooter>
                    {data ? (
                        <>
                            {editing && (
                                <button
                                    className='px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700'
                                    onClick={handlePatch}
                                >
                                    Save
                                </button>
                            )}
                            <button
                                className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700'
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                Delete
                            </button>
                            <DeleteDialog
                                itemName={data.name}
                                isOpen={isDeleteDialogOpen}
                                onClose={() => setIsDeleteDialogOpen(false)}
                                onDelete={handleDelete}
                            />
                        </>
                    ) : (
                        <div className='flex gap-x-2 items-center'>
                            <div className='flex items-center'>
                                <Switch
                                    checked={createMoreToggle}
                                    onCheckedChange={setCreateMoreToggle}
                                    className='mr-2'
                                />
                                <div className='text-xs font-light'>
                                    Create More
                                </div>
                            </div>
                            <Button onClick={handlePost}>Create</Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
