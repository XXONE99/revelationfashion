"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useRealtime(table: string, onChange: () => void) {
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        try {
          onChange()
        } catch (e) {
          console.error(`[Realtime:${table}] handler error`, e)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, onChange])
}


