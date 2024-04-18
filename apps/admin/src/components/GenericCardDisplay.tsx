"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GenericCard } from "./GenericCard";
import { GenericCreateNewCard } from "./GenericCreateNewCard";
import { InputField } from "./InputFieldMapper";

type Props = {
    data: any[];
    dataType: string;
    inputFields: InputField[];
};

function pluralize(word: string): string {
    if (word.endsWith("s")) {
        return word + "es";
    } else if (word.endsWith("y")) {
        return word.slice(0, -1) + "ies";
    } else if (word.endsWith("sh") || word.endsWith("ch")) {
        return word + "es";
    } else if (word.endsWith("class")) {
        return word + "es";
    } else {
        return word + "s";
    }
}

export function GenericCardDisplay({ data, dataType, inputFields }: Props) {
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
                    <GenericCard
                        key={item.id}
                        id={item.id}
                        inputFields={inputFields}
                        dataType={dataType}
                        data={item}
                        onDelete={refreshDisplay}
                    />
                ))}
                <GenericCreateNewCard
                    dataType={dataType}
                    inputFields={inputFields}
                    onSuccessfulSubmit={refreshDisplay}
                />
            </div>
        </div>
    );
}
