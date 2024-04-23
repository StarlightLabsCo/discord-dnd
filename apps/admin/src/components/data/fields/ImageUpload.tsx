import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Icons } from "../../Icons";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
    setImageUrl: (url: string) => void;
    className?: string;
};

export function ImageUpload({ setImageUrl, className }: ImageUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    useEffect(() => {
        const handleUpload = async () => {
            if (file) {
                setUploading(true);
                const base64 = await convertToBase64(file);
                const base64Content = base64.split(",")[1];

                const response = await fetch("/api/image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        file: base64Content,
                        contentType: file.type,
                    }),
                });

                const data = await response.json();
                setUploading(false);
                if (response.ok) {
                    setImageUrl(data.url);
                } else {
                    toast.error(`Upload failed: ${data.error}`);
                }
            }
        };

        if (file) {
            handleUpload();
        }
    }, [file, setImageUrl]);

    return (
        <>
            <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <div
                className={cn(
                    "flex flex-col gap-2 justify-center items-center text-xs font-light text-center border border-dashed cursor-pointer border-neutral-400 group",
                    className
                )}
                onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click();
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {uploading ? (
                    <div className='w-5 h-5 rounded-full border animate-spin border-neutral-500 border-t-transparent'></div>
                ) : (
                    <>
                        <p>Upload File</p>
                        <Icons.arrowUpOnSquare className='w-6 h-6 text-neutral-600' />
                    </>
                )}
            </div>
        </>
    );
}
