"use client";

import { Suspense, useState } from "react";
import { toast } from "sonner";
import { pluralize } from "@/lib/utils";
import { DataDialog } from "./DataDialog";
import { Card } from "../ui/card";
import { Icons } from "../Icons";

type Props = {
    data: any[];
    dataType: string;
};

export function DataCardDisplay({ data, dataType }: Props) {
    console.log(`DataCardDisplay: ${dataType}`);
    const [items, setItems] = useState(data);

    const refreshDisplay = async () => {
        const response = await fetch(`/api/data/${dataType}`, {
            method: "GET",
        });

        if (!response.ok) {
            toast.error(`Failed to fetch ${pluralize(dataType)}`);
        } else {
            const newItems = await response.json();
            setItems(newItems);
        }
    };

    const formattedDataType = dataType
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^\w/, (c) => c.toUpperCase());

    return (
        <div className='w-full h-full'>
            <div className='mb-20 text-xl'>
                {pluralize(
                    dataType.charAt(0).toUpperCase() + dataType.slice(1)
                ).replace(/([a-z])([A-Z])/g, "$1 $2")}
            </div>
            <div className='flex flex-wrap gap-2 w-full'>
                {items.map((item) => (
                    <Suspense key={item.id} fallback='Loading...'>
                        <DataDialog
                            dataType={dataType}
                            data={item}
                            onSuccessfulSubmit={refreshDisplay}
                            onDelete={refreshDisplay}
                        >
                            <Card className='w-48 h-48 rounded-lg cursor-pointer hover:scale-[102%]'>
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className='object-cover w-full h-36 rounded-t-lg'
                                />
                                <div className='p-1 text-sm'>{item.name}</div>
                            </Card>
                        </DataDialog>
                    </Suspense>
                ))}
                <Suspense fallback='Loading...'>
                    <DataDialog
                        dataType={dataType}
                        data={null}
                        onSuccessfulSubmit={refreshDisplay}
                        onDelete={refreshDisplay}
                    >
                        <div className='flex relative justify-center items-center w-48 h-48 rounded-lg border-dashed cursor-pointer border-[1px] border-neutral-400 group'>
                            <div className='absolute top-1 mx-auto text-xs font-light'>
                                New {formattedDataType}
                            </div>
                            <Icons.plus className='w-6 h-6 transition group-hover:scale-[130%]' />
                        </div>
                    </DataDialog>
                </Suspense>
            </div>
        </div>
    );
}
