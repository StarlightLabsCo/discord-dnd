"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DataCard } from "./DataCard";
import { InputField } from "./InputFieldMapper";
import { pluralize } from "@/lib/utils";

type Props = {
    data: any[];
    dataType: string;
    inputFields: InputField[];
};

export function DataCardDisplay({ data, dataType, inputFields }: Props) {
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

    return (
        <div className='w-full h-full'>
            <div className='mb-20 text-xl'>
                {pluralize(
                    dataType.charAt(0).toUpperCase() + dataType.slice(1)
                ).replace(/([a-z])([A-Z])/g, "$1 $2")}
            </div>
            <div className='flex flex-wrap gap-2 w-full'>
                {items.map((item) => (
                    <DataCard
                        key={item.id}
                        inputFields={inputFields}
                        dataType={dataType}
                        data={item}
                        onSuccessfulSubmit={refreshDisplay}
                        onDelete={refreshDisplay}
                    />
                ))}
                <DataCard
                    dataType={dataType}
                    data={null} // Create new mode
                    inputFields={inputFields}
                    onSuccessfulSubmit={refreshDisplay}
                />
            </div>
        </div>
    );
}
