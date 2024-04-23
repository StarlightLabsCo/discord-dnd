type AbilityScoreDisplayProps = {
    label: string;
    value: number;
    main?: boolean;
};

export function AbilityScoreDisplay({
    label,
    value,
    main,
}: AbilityScoreDisplayProps) {
    return (
        <div className='flex flex-col items-center'>
            <div
                className={`text-[1vw] font-bold text-[#A5A5A5] ${main ? "text-[#A5A5A5]" : "text-transparent"}`}
            >
                ★
            </div>
            <div className='text-[1.1vw] font-bold text-[#A5A5A5]'>{label}</div>
            <div className='text-[1.1vw] font-black'>{value}</div>
        </div>
    );
}
