"use client";

import { useEffect, useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { DataPreview } from "@/components/data/fields/DataPreview";

type Item = {
    id: string;
    name: string;
    imageUrl: string;
};

type Props = {
    name: string;
    dataType: string;
    selectedId: string;
    setSelectedId: (actId: string) => void;
    disabled?: boolean;
    required?: boolean;
};

export function DataDropdown({
    name,
    dataType,
    selectedId,
    setSelectedId,
    disabled,
    required,
}: Props) {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            const response = await fetch(`/api/data/${dataType}`);
            if (!response.ok) {
                console.error(`Failed to fetch ${dataType}s`);
                return;
            }
            const fetchedItems = await response.json();
            setItems(fetchedItems);
            setSelectedItem(
                fetchedItems.find((item: Item) => item.id === selectedId) ||
                    null
            );
        };

        fetchOptions();
    }, [dataType, selectedId]);

    return (
        <>
            <Combobox
                name={name}
                dataType={dataType}
                options={items.map((item: Item) => ({
                    value: item.id,
                    label: item.name,
                }))}
                selectedValue={selectedId}
                setSelectedValue={setSelectedId}
                disabled={disabled}
                required={required}
            />
            {selectedItem && (
                <DataPreview
                    item={selectedItem}
                    dataType={dataType}
                    className='h-32'
                />
            )}
        </>
    );
}
