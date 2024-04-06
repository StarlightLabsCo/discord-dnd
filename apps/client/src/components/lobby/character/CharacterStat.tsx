type CharacterStatProps = {
    label: string;
    value: string;
    main?: boolean;
};

export function CharacterStat({ label, value, main }: CharacterStatProps) {
    return (
        <div className='flex flex-col items-center'>
            <div
                className={`font-bold text-[#A5A5A5] ${main ? "text-[#A5A5A5]" : "text-transparent"}`}
            >
                ★
            </div>
            <div className='font-bold text-[#A5A5A5]'>{label}</div>
            <div className='font-bold'>{value}</div>
        </div>
    );
}
