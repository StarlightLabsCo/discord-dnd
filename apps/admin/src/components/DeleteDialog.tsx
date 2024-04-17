import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

type DeleteDialogProps = {
    itemId: string;
    itemName: string;
    endpoint: string;
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
};

export function DeleteDialog({
    itemId,
    itemName,
    endpoint,
    isOpen,
    onClose,
    onDelete,
}: DeleteDialogProps) {
    const handleDelete = async () => {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: itemId }),
        });

        onClose();
        if (response.ok) {
            toast.success(`${itemName} deleted successfully`);
            onDelete();
        } else {
            toast.error(`Failed to delete ${itemName}`);
        }
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {itemName}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <button
                        className='px-4 py-2 text-white bg-red-600 rounded hover:bg-red-800'
                        onClick={handleDelete}
                    >
                        Confirm
                    </button>
                    <DialogClose
                        asChild
                        className='px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400'
                        onClick={onClose}
                    >
                        <button>Cancel</button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
