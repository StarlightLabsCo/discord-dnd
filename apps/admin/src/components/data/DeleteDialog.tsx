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
    itemName: string;
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
};

export function DeleteDialog({
    itemName,
    isOpen,
    onClose,
    onDelete,
}: DeleteDialogProps) {
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
                        onClick={onDelete}
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
