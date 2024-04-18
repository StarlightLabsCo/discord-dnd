import React, { useEffect, useState } from "react";
import { ForeignKeyPreview } from "./ForeignKeyPreview";

type Props = {
    parentId: string;
    foreignKeyField: string;
    dataType: string;
};

export function ForeignKeyArray({
    parentId,
    foreignKeyField,
    dataType,
}: Props) {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch(`/api/${dataType}?${foreignKeyField}=${parentId}`);
            if (!response.ok) {
                console.error(`Failed to fetch ${dataType}s`);
                return;
            }
            const fetchedItems = await response.json();

            setItems(fetchedItems);
        };

        fetchItems();
    }, [dataType]);

    return (
        <div className='flex flex-wrap gap-2'>
            {items.map((item) => (
                <ForeignKeyPreview
                    key={item.id}
                    item={item}
                    dataType={dataType}
                />
            ))}
        </div>
    );
}
