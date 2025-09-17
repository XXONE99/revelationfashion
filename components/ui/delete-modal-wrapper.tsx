"use client"
import { DeleteModal } from "./delete-modal"
import { ProgressModal } from "./progress-modal"
import { SuccessNotification } from "./success-notification"
import { useDeleteModal } from "@/hooks/useDeleteModal"

interface DeleteModalWrapperProps {
  children: (openDeleteModal: (itemName: string, itemType?: string, onConfirm?: () => Promise<void>) => void) => React.ReactNode
}

export function DeleteModalWrapper({ children }: DeleteModalWrapperProps) {
  const {
    isOpen,
    isProgressOpen,
    isSuccessOpen,
    progress,
    itemName,
    itemType,
    openDeleteModal,
    closeDeleteModal,
    handleConfirm,
    closeSuccess
  } = useDeleteModal()

  return (
    <>
      {children(openDeleteModal)}
      
      <DeleteModal
        isOpen={isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirm}
        title={`Confirm deletion of ${itemName}`}
        itemName={itemName}
        itemType={itemType}
      />
      
      <ProgressModal
        isOpen={isProgressOpen}
        progress={progress}
        message={`Deleting ${isProgressOpen ? '1' : '0'} file(s)...`}
        itemCount={1}
      />
      
      <SuccessNotification
        isOpen={isSuccessOpen}
        onClose={closeSuccess}
        message="Successfully deleted 1 file(s)"
        itemCount={1}
        itemType="file"
      />
    </>
  )
}
