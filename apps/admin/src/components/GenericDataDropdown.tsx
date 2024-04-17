"use client";

import { useEffect, useState } from "react";
import { Combobox } from "@/components/ui/combobox";

type Option = {
    value: string;
    label: string;
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

    useEffect(() => {
        const fetchOptions = async () => {
            const response = await fetch(`/api/${dataType}`);
            if (!response.ok) {
                console.error(`Failed to fetch ${dataType}s`);
                return;
            }
            const items = await response.json();
            const newOptions = items.map((item: any) => ({
                value: item.id,
                label: item.name,
            }));
            setOptions(newOptions);
        };

        fetchOptions();
    }, []);

    return (
        <Combobox
            name={name}
            options={options}
            selectedValue={selectedId}
            setSelectedValue={setSelectedId}
        />
    );
}
