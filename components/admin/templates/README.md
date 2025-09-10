# Modal Delete Template

Template modal delete yang profesional dengan animasi seperti di gambar.

## Komponen yang Tersedia

### 1. DeleteModal
Modal konfirmasi delete dengan style dark theme dan animasi.

### 2. ProgressModal  
Modal progress bar untuk animasi delete dengan loading spinner.

### 3. SuccessNotification
Notifikasi sukses dengan animasi dan auto-dismiss.

### 4. DeleteModalWrapper
Wrapper yang menggabungkan semua modal dan hook.

### 5. useDeleteModal
Hook untuk mengelola state modal delete.

## Cara Penggunaan

### 1. Import Komponen
```tsx
import { DeleteModalWrapper } from '@/components/ui/delete-modal-wrapper'
import { DeleteButton } from '@/components/admin/templates/DeleteButton'
```

### 2. Wrap Komponen dengan DeleteModalWrapper
```tsx
return (
  <DeleteModalWrapper>
    {(openDeleteModal) => (
      <div>
        {/* Konten admin */}
        <DeleteButton
          onDelete={() => openDeleteModal(
            item.name, 
            "item", 
            () => handleDelete(item)
          )}
          itemName={item.name}
          itemType="item"
        />
      </div>
    )}
  </DeleteModalWrapper>
)
```

### 3. Implementasi handleDelete
```tsx
const handleDelete = async (item: Item) => {
  try {
    await Item.delete(item.id)
    fetchItems() // Refresh data
  } catch (error) {
    console.error("Delete failed:", error)
    throw error // Penting: throw error untuk menangani di modal
  }
}
```

## Fitur

- ✅ Dark theme yang profesional
- ✅ Animasi smooth dengan Framer Motion
- ✅ Progress bar dengan loading spinner
- ✅ Success notification dengan auto-dismiss
- ✅ Error handling yang baik
- ✅ Responsive design
- ✅ Accessibility support

## Styling

- **Background**: Dark gray (#1f2937)
- **Border**: Gray (#374151) 
- **Text**: White
- **Warning Icon**: Orange (#f59e0b)
- **Delete Button**: Red (#dc2626)
- **Success**: Green (#10b981)
- **Progress Bar**: Green (#10b981)

## Animasi

- Modal muncul dengan scale dan fade
- Progress bar animasi smooth
- Success notification slide dari kanan
- Loading spinner berputar
- Backdrop blur effect
