import React from "react";
import { ImageUpload } from "./ImageUpload";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";

type Props = {
    imageUrl: string;
    setImageUrl: (url: string) => void;
    className?: string;
    disabled?: boolean;
};

export function ImageUrlSelector({
    imageUrl,
    setImageUrl,
    className,
    disabled,
}: Props) {
    return (
        <div className={cn("flex flex-col gap-y-1", className)}>
            <Input
                type='text'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder={imageUrl ? "Existing Url" : "Enter Url"}
                disabled={disabled}
            />
            <div className='w-full h-64'>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt='Selected'
                        className='object-contain w-full h-full rounded-lg max-w-[300px]'
                    />
                ) : (
                    <ImageUpload
                        setImageUrl={setImageUrl}
                        className='h-full rounded-lg'
                    />
                )}
            </div>
        </div>
    );
}
