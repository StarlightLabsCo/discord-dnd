import { useEffect, useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { Icons } from "@/components/Icons";
import { useRouter } from "next/navigation";
import { pluralize } from "@/lib/utils";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

type Props = {
    items: any[];
    dataType: string;
    disabled?: boolean;
};

export function DataArray({ items, dataType, disabled }: Props) {
    const router = useRouter();

    const [selectedItems, setSelectedItems] = useState<any[]>(items);
    const [potentialItems, setPotentialItems] = useState<any[]>([]);
    const [isNavigateDialogOpen, setIsNavigateDialogOpen] = useState(false);
    const [navigateItemId, setNavigateItemId] = useState<string | null>(null);

    const fetchPotentialItems = async () => {
        const response = await fetch(`/api/data/${dataType}`);
        if (!response.ok) {
            console.error(`Failed to fetch ${dataType}s`);
            return;
        }

        const fetchedItems = await response.json();
        const filteredItems = fetchedItems.filter(
            (fetchedItem: any) =>
                !selectedItems.some(
                    (selectedItem) => selectedItem.id === fetchedItem.id
                )
        );
        setPotentialItems(filteredItems);
    };

    useEffect(() => {
        fetchPotentialItems();
    }, [dataType, selectedItems]);

    const handleSelectItem = (item: any) => {
        if (
            !selectedItems.some((selectedItem) => selectedItem.id === item.id)
        ) {
            setSelectedItems((prevItems) => [...prevItems, item]);
        }
    };

    const handleDeselectItem = (itemId: string) => {
        setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
    };

    const handleNavigate = () => {
        if (navigateItemId) {
            router.push(`/${pluralize(dataType)}?id=${navigateItemId}`);
            setIsNavigateDialogOpen(false);
        }
    };

    const comboboxOptions = potentialItems.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    return (
        <div className='flex flex-wrap gap-2 p-1 w-full h-24 rounded-lg border '>
            {selectedItems.map((item) => (
                <div className='h-8 flex items-center justify-between px-4 py-2 rounded-lg border w-40'>
                    <div className='grow text-sm font-light'>{item.name}</div>
                    <div className='flex gap-x-2 items-center'>
                        <Icons.arrowTopRightOnSquare
                            onClick={() => {
                                setNavigateItemId(item.id);
                                setIsNavigateDialogOpen(true);
                            }}
                            className='w-4 h-4 text-green-500 hover:scale-105 cursor-pointer'
                        />
                        <Icons.x
                            onClick={() => handleDeselectItem(item.id)}
                            className='w-4 h-4 text-red-500 hover:scale-105 cursor-pointer'
                        />
                    </div>
                </div>
            ))}
            <Combobox
                name={dataType}
                options={comboboxOptions}
                selectedValue=''
                setSelectedValue={(selectedId) => {
                    const item = potentialItems.find(
                        (item) => item.id === selectedId
                    );
                    if (item) handleSelectItem(item);
                }}
                required={false}
                disabled={disabled}
                className='h-8'
            />
            {isNavigateDialogOpen && (
                <Dialog
                    open={isNavigateDialogOpen}
                    onOpenChange={setIsNavigateDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Navigation Confirmation</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to navigate to this page?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <button
                                className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700'
                                onClick={handleNavigate}
                            >
                                Yes, navigate
                            </button>
                            <button
                                className='px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-700'
                                onClick={() => setIsNavigateDialogOpen(false)}
                            >
                                Cancel
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
