import React from "react";
import { GenericDataDropdown } from "./GenericDataDropdown";
import { GenericEnumDropdown } from "./GenericEnumDropdown";
import { TextArrayInput } from "./TextArrayInput";
import { Input } from "@/components/ui/input";
import { ForeignKeyArray } from "./ForeignKeyArray";

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
          foreignKeyField: string;
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
      };

type Props = {
    parentId: string | null; // if this is a create new form, parentId will be null
    inputFields: InputField[];
    formData: { [key: string]: any };
    setFormData: (data: { [key: string]: any }) => void;
};

export function InputFieldMapper({
    parentId,
    inputFields,
    formData,
    setFormData,
}: Props) {
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
                                <GenericDataDropdown
                                    name={field.label}
                                    dataType={field.dataType}
                                    selectedId={formData[field.name]}
                                    setSelectedId={(id) =>
                                        setFormData({
                                            ...formData,
                                            [field.name]: id,
                                        })
                                    }
                                />
                            </div>
                        );
                    case "foreignkeyarray":
                        if (parentId) {
                            return (
                                <div
                                    className='flex flex-col gap-y-1'
                                    key={field.name}
                                >
                                    {labelWithAsterisk}
                                    <ForeignKeyArray
                                        parentId={parentId}
                                        foreignKeyField={field.foreignKeyField}
                                        dataType={field.dataType}
                                    />
                                </div>
                            );
                        } else {
                            return null;
                        }
                    case "enum":
                        return (
                            <div
                                className='flex flex-col gap-y-1'
                                key={field.name}
                            >
                                {labelWithAsterisk}
                                <GenericEnumDropdown
                                    name={field.label}
                                    enumObject={field.enumObject}
                                    selectedValue={formData[field.name]}
                                    setSelectedValue={(value) =>
                                        setFormData({
                                            ...formData,
                                            [field.name]: value,
                                        })
                                    }
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
                                />
                            </div>
                        );
                }
            })}
        </>
    );
}
