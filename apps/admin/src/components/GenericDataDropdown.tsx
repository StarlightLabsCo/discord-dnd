"use client";

import { useEffect, useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { ForeignKeyPreview } from "./ForeignKeyPreview";

type Option = {
    value: string;
    label: string;
};

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
};

export function GenericDataDropdown({
    name,
    dataType,
    selectedId,
    setSelectedId,
}: Props) {
    const [options, setOptions] = useState<Option[]>([]);
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
            const newOptions = fetchedItems.map((item: Item) => ({
                value: item.id,
                label: item.name,
            }));
            setOptions(newOptions);
            setItems(fetchedItems);
        };

        fetchOptions();
    }, [dataType]);

    useEffect(() => {
        const foundItem = items.find((item) => item.id === selectedId);
        setSelectedItem(foundItem || null);
    }, [selectedId, items]);

    return (
        <>
            <Combobox
                name={name}
                options={options}
                selectedValue={selectedId}
                setSelectedValue={setSelectedId}
            />
            {selectedItem && (
                <ForeignKeyPreview item={selectedItem} dataType={dataType} />
            )}
        </>
    );
}
