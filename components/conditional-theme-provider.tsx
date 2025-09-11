'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { ReactNode } from 'react'

interface ConditionalThemeProviderProps {
  children: ReactNode
}

export function ConditionalThemeProvider({ children }: ConditionalThemeProviderProps) {
  const pathname = usePathname()
  
  // Only enable theme provider for admin routes
  const isAdminRoute = pathname.startsWith('/admin')
  
  if (isAdminRoute) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    )
  }
  
  // For non-admin routes, render children without theme provider
  return <>{children}</>
}
