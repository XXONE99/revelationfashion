import { useState } from "react"

interface DeleteModalState {
  isOpen: boolean
  isProgressOpen: boolean
  isSuccessOpen: boolean
  progress: number
  itemName: string
  itemType: string
  onConfirm: (() => Promise<void>) | null
}

export function useDeleteModal() {
  const [state, setState] = useState<DeleteModalState>({
    isOpen: false,
    isProgressOpen: false,
    isSuccessOpen: false,
    progress: 0,
    itemName: "",
    itemType: "item",
    onConfirm: null
  })

  const openDeleteModal = (
    itemName: string, 
    itemType: string = "item", 
    onConfirm?: () => Promise<void>
  ) => {
    setState({
      isOpen: true,
      isProgressOpen: false,
      isSuccessOpen: false,
      progress: 0,
      itemName,
      itemType,
      onConfirm
    })
  }

  const closeDeleteModal = () => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      onConfirm: null
    }))
  }

  const startProgress = () => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      isProgressOpen: true,
      progress: 0
    }))
  }

  const updateProgress = (progress: number) => {
    setState(prev => ({
      ...prev,
      progress
    }))
  }

  const showSuccess = () => {
    setState(prev => ({
      ...prev,
      isProgressOpen: false,
      isSuccessOpen: true
    }))
  }

  const closeSuccess = () => {
    setState(prev => ({
      ...prev,
      isSuccessOpen: false,
      onConfirm: null
    }))
  }

  const handleConfirm = async () => {
    if (!state.onConfirm) return

    try {
      startProgress()
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        updateProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      await state.onConfirm()
      showSuccess()
    } catch (error) {
      console.error("Delete failed:", error)
      setState(prev => ({
        ...prev,
        isProgressOpen: false
      }))
    }
  }

  return {
    ...state,
    openDeleteModal,
    closeDeleteModal,
    handleConfirm,
    closeSuccess
  }
}
