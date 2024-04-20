import React from "react";
import { DataDropdown } from "./fields/DataDropdown";
import { EnumDropdown } from "./fields/EnumDropdown";
import { TextArrayInput } from "./fields/TextArrayInput";
import { Input } from "@/components/ui/input";
import { DataArray } from "./fields/DataArray";
import { ImageUrlSelector } from "./fields/ImageUrlSelector";

import { inputFieldDictionary } from "./InputFieldDictionary";

export type InputField =
    | {
          type: "text" | "textarea" | "number" | "textarray" | "checkbox";
          name: string; // sent to server
          label: string; // displayed to user
          required: boolean;
      }
    | {
          type: "foreignkey";
          dataType: string; // required for foreignkey
          name: string;
          label: string;
          required: boolean;
      }
    | {
          type: "foreignkeyarray";
          dataType: string;
          name: string;
          label: string;
          required: boolean;
      }
    | {
          type: "enum";
          enumObject: any; // Direct reference to the enum object
          name: string;
          label: string;
          required: boolean;
      }
    | {
          type: "imageUrl";
          name: string;
          label: string;
          required: boolean;
      };

type Props = {
    dataType: string;
    data: any[];
    formData: { [key: string]: any };
    setFormData: (data: { [key: string]: any }) => void;
    disabled?: boolean;
};

export function InputFieldMapper({
    dataType,
    data,
    formData,
    setFormData,
    disabled,
}: Props) {
    const inputFields = inputFieldDictionary[dataType];

    return (
        <>
            {inputFields.map((field) => {
                const labelWithAsterisk = (
                    <div className='text-xs font-light'>
                        {field.label}
                        {field.required && (
                            <span className='text-red-500'>*</span>
                        )}
                    </div>
                );

                switch (field.type) {
                    case "foreignkey":
                        return (
                            <div
                                className='flex flex-col gap-y-1'
                                key={field.name}
                            >
                                {labelWithAsterisk}
                                <DataDropdown
                                    name={field.label}
                                    dataType={field.dataType}
                                    selectedId={formData[field.name]}
                                    setSelectedId={(id) =>
                                        setFormData({
                                            ...formData,
                                            [field.name]: id,
                                        })
                                    }
                                    disabled={disabled}
                                    required={field.required}
                                />
                            </div>
                        );
                    case "foreignkeyarray":
                        return (
                            <div
                                className='flex flex-col gap-y-1'
                                key={field.name}
                            >
                                {labelWithAsterisk}
                                <DataArray
                                    items={
                                        data
                                            ? data[
                                                  field.name as keyof typeof data
                                              ]
                                            : []
                                    }
                                    dataType={field.dataType}
                                    disabled={disabled}
                                />
                            </div>
                        );
                    case "enum":
                        return (
                            <div
                                className='flex flex-col gap-y-1'
                                key={field.name}
                            >
                                {labelWithAsterisk}
                                <EnumDropdown
                                    name={field.name}
                                    enumObject={field.enumObject}
                                    selectedValue={formData[field.name]}
                                    setSelectedValue={(value) =>
                                        setFormData({
                                            ...formData,
                                            [field.name]: value,
                                        })
                                    }
                                    disabled={disabled}
                                    required={field.required}
                                />
                            </div>
                        );
                    case "textarray":
                        return (
                            <div
                                className='flex flex-col gap-y-1'
                                key={field.name}
                            >
                                {labelWithAsterisk}
                                <TextArrayInput
                                    values={formData[field.name] || []}
                                    onChange={(newValues) =>
                                        setFormData({
                                            ...formData,
                                            [field.name]: newValues,
                                        })
                                    }
                                    disabled={disabled}
                                />
                            </div>
                        );
                    case "imageUrl":
                        return (
                            <div
                                className='flex flex-col gap-y-1'
                                key={field.name}
                            >
                                {labelWithAsterisk}
                                <ImageUrlSelector
                                    imageUrl={formData[field.name]}
                                    setImageUrl={(url) =>
                                        setFormData({
                                            ...formData,
                                            [field.name]: url,
                                        })
                                    }
                                    className='mb-2'
                                    disabled={disabled}
                                />
                            </div>
                        );
                    default:
                        return (
                            <div
                                className='flex flex-col gap-y-1'
                                key={field.name}
                            >
                                {labelWithAsterisk}
                                <Input
                                    type={field.type}
                                    value={formData[field.name]}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            [field.name]: e.target.value,
                                        })
                                    }
                                    className='mb-2'
                                    disabled={disabled}
                                />
                            </div>
                        );
                }
            })}
        </>
    );
}
