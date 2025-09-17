"use client"

import { ServerError } from "@/components/error-pages/server-error"

export default function AdminError() {
  return (
    <ServerError 
      title="500 ADMIN SERVER ERROR"
      message="Something went wrong in the admin panel."
      errorCode="500"
      onRefresh={() => window.location.reload()}
    />
  )
}
