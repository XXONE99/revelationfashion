"use client"

import { useEffect } from 'react'
import { SITE_URL } from '@/lib/site'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSEOProps {
  items: BreadcrumbItem[]
}

export default function BreadcrumbSEO({ items }: BreadcrumbSEOProps) {
  useEffect(() => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${SITE_URL}${item.url}`
      }))
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [items])

  return null
}
