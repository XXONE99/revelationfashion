"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupabaseTest() {
  const [testResult, setTestResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult("")

    try {
      console.log("🔍 [TEST] Memulai test koneksi Supabase...")
      
      const supabase = createClient()
      console.log("✅ [TEST] Client Supabase berhasil dibuat")
      
      // Test koneksi dengan query sederhana
      const { data, error } = await supabase
        .from("users")
        .select("count")
        .limit(1)

      if (error) {
        console.log("❌ [TEST] Error:", error.message)
        setTestResult(`❌ Error: ${error.message}`)
      } else {
        console.log("✅ [TEST] Koneksi berhasil!")
        setTestResult("✅ Koneksi ke Supabase berhasil!")
      }
    } catch (error) {
      console.log("❌ [TEST] Exception:", error)
      setTestResult(`❌ Exception: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Koneksi Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Testing..." : "Test Koneksi"}
        </Button>
        
        {testResult && (
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>Environment Variables:</p>
          <p>• SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Not Set"}</p>
          <p>• SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not Set"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
