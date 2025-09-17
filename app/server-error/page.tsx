"use client"

import { ServerError } from "@/components/error-pages/server-error"

export default function ServerErrorPage() {
  return (
    <ServerError 
      title="500 SERVER ERROR"
      message="Something went wrong on our end."
      errorCode="500"
      onRefresh={() => window.location.reload()}
    />
  )
}
