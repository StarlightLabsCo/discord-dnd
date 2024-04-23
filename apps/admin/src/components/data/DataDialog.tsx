"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

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

import { InputFieldMapper } from "@/components/data/InputFieldMapper";

import { DeleteDialog } from "./DeleteDialog";
import { inputFieldDictionary } from "./InputFieldDictionary";

type Props = {
    children: React.ReactNode;

    dataType: string;
    data?: any; // if data is not provided, we are in create new mode

    onSuccessfulSubmit?: (id: string) => void; // create, edit
    onDelete?: () => void;

    className?: string;
};

export function DataDialog({
    children,

    dataType,
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
    const inputFields = inputFieldDictionary[dataType];
    if (!inputFields) {
        console.log(`Data type: ${dataType}`);
        throw new Error(`No input field dictionary found for ${dataType}`);
    }
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
            const { id } = await response.json();

            onSuccessfulSubmit?.(id);
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
                const originalValue = data[key];
                const newValue = formData[key];
                console.log(key, originalValue, newValue);

                if (Array.isArray(originalValue) && Array.isArray(newValue)) {
                    if (
                        originalValue.sort().toString() !==
                        newValue.sort().toString()
                    ) {
                        diff[key] = newValue;
                    }
                } else if (String(newValue) !== String(originalValue)) {
                    diff[key] = newValue;
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
            onSuccessfulSubmit(data.id);
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent
                {...(data
                    ? {
                          isLocked: !editing,
                          onToggleLock: () => setEditing(!editing),
                      }
                    : {})}
                onPointerDownOutside={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
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
                    dataType={dataType}
                    data={data}
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
