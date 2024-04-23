import { s3UrlRewriter } from "@/lib/discord/utils";

export interface SelectableGridItem {
    id: string;
    title: string;
    src: string;
}

interface SelectableGridProps {
    items: SelectableGridItem[];
    selected: string;
    setSelected: (id: string) => void;
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
            className={`grid gap-[1.25vw] w-[80%]`}
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {items.map((item, index) => (
                <div key={index} className='flex flex-col items-center'>
                    <div
                        className={`shrink-0 relative rounded-[1vw] cursor-pointer ${selected === item.id ? "border border-yellow-600" : "border border-white"} hover:scale-105 group`}
                        onClick={() => setSelected(item.id)}
                    >
                        {selected !== item.id && (
                            <div className='absolute inset-0 w-full h-full rounded-[1vw] bg-black/50 group-hover:bg-transparent' />
                        )}
                        <img
                            src={s3UrlRewriter(item.src)}
                            className={`rounded-[1vw] aspect-square ${columns === 4 ? "w-[9vw] h-[9vw]" : "w-[11vw] h-[11vw]"}`}
                        />
                    </div>
                    <div className='mt-[0.5vw] text-[1.1vw]'>{item.title}</div>
                </div>
            ))}
        </div>
    );
};
