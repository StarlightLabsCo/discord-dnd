import React from "react";

interface Item {
    src: string;
    title: string;
    subtitle: string;
    value: string;
}

interface SelectableGridProps {
    items: Item[];
    selected: string;
    setSelected: (title: string) => void;
    columns: number;
}

export const SelectableGrid: React.FC<SelectableGridProps> = ({
    items,
    selected,
    setSelected,
    columns,
}) => {
    return (
        <div
            className={`grid gap-4 w-[80%]`}
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {items.map((item, index) => (
                <div key={index} className='flex flex-col items-center'>
                    <div
                        className={`relative rounded-xl cursor-pointer ${selected === item.value ? "border border-yellow-600" : "border border-white"} hover:scale-105 group`}
                        onClick={() => setSelected(item.value)}
                    >
                        {selected !== item.value && (
                            <div className='absolute inset-0 w-full h-full rounded-xl bg-black/50 group-hover:bg-transparent' />
                        )}
                        <img
                            src={item.src}
                            className={`rounded-xl ${columns === 4 ? "w-[9vw] h-[9vw]" : "w-[12vw] h-[12vw]"}`}
                        />
                    </div>

                    <div className='mt-2'>{item.title}</div>
                    <div className='text-sm font-light text-gray-500'>
                        {item.subtitle}
                    </div>
                </div>
            ))}
        </div>
    );
};
