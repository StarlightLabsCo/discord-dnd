import { ForeignKeyPreview } from "./ForeignKeyPreview";

type Props = {
    items: any[];
    dataType: string;
};

export function ForeignKeyArray({ items, dataType }: Props) {
    return (
        <div className='flex flex-wrap gap-2'>
            {items.length > 0 ? (
                items.map((item) => (
                    <ForeignKeyPreview
                        key={item.id}
                        item={item}
                        dataType={dataType}
                    />
                ))
            ) : (
                <div className='text-xs font-light'>No relationships yet.</div>
            )}
        </div>
    );
}
