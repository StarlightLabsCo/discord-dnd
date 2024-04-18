import { useState, useEffect } from "react";
import { Combobox } from "@/components/ui/combobox";

type Option = {
    value: string;
    label: string;
};

type Props = {
    name: string;
    enumObject: { [key: string]: string | number };
    selectedValue: string;
    setSelectedValue: (value: string) => void;
};

export function GenericEnumDropdown({
    name,
    enumObject,
    selectedValue,
    setSelectedValue,
}: Props) {
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        const enumOptions = Object.entries(enumObject).map(([key, value]) => ({
            value: key,
            label: value.toString(),
        }));
        setOptions(enumOptions);
    }, [enumObject]);

    return (
        <Combobox
            name={name}
            options={options}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
        />
    );
}
