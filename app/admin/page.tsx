"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkAdminAuth } from "@/components/admin/AdminLogin"

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = checkAdminAuth()
    if (isAuth) {
      console.log("✅ [ADMIN PAGE] User already authenticated, redirecting to dashboard")
      router.push("/admin/dashboard")
    } else {
      console.log("❌ [ADMIN PAGE] User not authenticated, redirecting to dashboard for login")
      router.push("/admin/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  )
}