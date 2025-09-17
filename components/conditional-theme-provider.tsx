'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { ReactNode } from 'react'

interface ConditionalThemeProviderProps {
  children: ReactNode
}

export function ConditionalThemeProvider({ children }: ConditionalThemeProviderProps) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
      suppressHydrationWarning
    >
      {children}
    </ThemeProvider>
  )
}
