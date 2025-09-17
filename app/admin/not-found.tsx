import { Error404 } from "@/components/error-pages/404-error"

export default function AdminNotFound() {
  return <Error404 
    title="404 ADMIN PAGE NOT FOUND"
    message="This admin page doesn't exist."
    backUrl="/admin/dashboard"
  />
}
