"use client"

import { useStoreModal } from "@/hooks/use-store-model"
import { Modal } from "@/components/ui/model"

export const StoreModal = () => {
    const storeModal = useStoreModal();

    return (
        <Modal
            title="Create store"
            description="Add a store to manage a new store seperately"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            Future Create Store Form
        </Modal>
    );
}