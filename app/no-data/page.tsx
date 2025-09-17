import { NoDataError } from "@/components/error-pages/no-data-error"

export default function NoDataPage() {
  return (
    <NoDataError 
      title="No Data Found!"
      message="There's nothing to show here yet."
      showRefreshButton={true}
      showAddButton={false}
      onRefresh={() => window.location.reload()}
    />
  )
}
