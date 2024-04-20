"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type Option = {
    value: string;
    label: string;
};

type ComboboxProps = {
    name: string;
    options: Option[];
    selectedValue: string;
    setSelectedValue: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string;
};

export function Combobox({
    name,
    options = [],
    selectedValue,
    setSelectedValue,
    required,
    disabled,
    className,
}: ComboboxProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                    disabled={disabled}
                >
                    {selectedValue
                        ? options.find(
                              (option) => option.value === selectedValue
                          )?.label
                        : `Select ${name}...`}
                    <ChevronsUpDown className='ml-2 w-4 h-4 opacity-50 shrink-0' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput placeholder={`Search ${name}...`} />
                    <CommandEmpty>No {name} found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {!required && (
                                <CommandItem
                                    key='none'
                                    value=''
                                    onSelect={() => handleSelect("")}
                                    className='hover:bg-[hsl(var(--accent))] cursor-pointer'
                                >
                                    <Check className='mr-2 w-4 h-4 opacity-0' />
                                    None
                                </CommandItem>
                            )}

                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                    className='cursor-pointer'
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValue === option.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
