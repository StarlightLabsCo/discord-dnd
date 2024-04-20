import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/Icons";

type TextArrayInputProps = {
    values: string[];
    onChange: (newValues: string[]) => void;
    disabled?: boolean;
};

export const TextArrayInput: React.FC<TextArrayInputProps> = ({
    values,
    onChange,
    disabled = false,
}) => {
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        if (inputValue.trim() !== "") {
            onChange([...values, inputValue]);
            setInputValue("");
        }
    };

    const handleDelete = (index: number) => {
        const newValues = values.filter((_, i) => i !== index);
        onChange(newValues);
    };

    const handleEdit = (index: number, newValue: string) => {
        const newValues = values.map((value, i) =>
            i === index ? newValue : value
        );
        onChange(newValues);
    };

    useEffect(() => {
        const handleBlur = () => {
            if (inputValue.trim() === "") {
                setInputValue("");
            } else {
                handleAdd();
            }
        };

        window.addEventListener("blur", handleBlur);
        return () => window.removeEventListener("blur", handleBlur);
    }, [inputValue, values]);

    return (
        <div>
            <div className='flex flex-col text-xs font-light'>
                {values.map((value, index) => (
                    <div
                        key={index}
                        className='flex items-center p-1 mb-1 rounded-lg border'
                    >
                        <Input
                            type='text'
                            value={value}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleEdit(index, e.target.value)}
                            onBlur={() => {
                                if (values[index].trim() === "") {
                                    handleDelete(index);
                                } else {
                                    handleEdit(index, values[index]);
                                }
                            }}
                            disabled={disabled}
                            className='flex-1 font-light border-0 border-none shadow-none drop-shadow-none focus:outline-none focus:ring-0 focus:border-0 focus-visible:border-0 focus-visible:ring-0'
                        />
                        <Icons.x
                            className='mr-3 w-4 h-4 transition cursor-pointer text-neutral-500 hover:scale-110 hover:text-red-500'
                            onClick={() => handleDelete(index)}
                        />
                    </div>
                ))}
            </div>
            <div className='flex gap-2 items-center'>
                <Input
                    type='text'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleAdd();
                        }
                    }}
                    onBlur={() => {
                        if (inputValue.trim() !== "") {
                            handleAdd();
                        }
                    }}
                    disabled={disabled}
                    className='font-light'
                />
            </div>
        </div>
    );
};
