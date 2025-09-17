"use client"

import { NoDataError } from "@/components/error-pages/no-data-error"

export default function AdminNoDataPage() {
  return (
    <NoDataError 
      title="No Data Found!"
      message="There's no data available in the admin panel."
      showRefreshButton={true}
      showAddButton={true}
      onRefresh={() => window.location.reload()}
      onAdd={() => window.location.href = '/admin/dashboard'}
      addButtonText="Go to Dashboard"
    />
  )
}
