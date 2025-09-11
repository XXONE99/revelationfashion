'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface ConditionalThemeProviderProps {
  children: ReactNode
}

export function ConditionalThemeProvider({ children }: ConditionalThemeProviderProps) {
  const [isClient, setIsClient] = useState(false)
  const [isAdminRoute, setIsAdminRoute] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const pathname = usePathname()
  
  useEffect(() => {
    if (isClient) {
      setIsAdminRoute(pathname.startsWith('/admin'))
    }
  }, [isClient, pathname])
  
  // Only enable theme provider for admin routes and after hydration
  if (isClient && isAdminRoute) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    )
  }
  
  // For non-admin routes or during SSR, render children without theme provider
  return <>{children}</>
}
