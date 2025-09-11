"use client"

import Head from 'next/head'
import { SITE_URL } from '@/lib/site'

interface PageSEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
}

export default function PageSEO({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url = '',
  type = 'website'
}: PageSEOProps) {
  const fullTitle = `${title} | REVELATION Konveksi Bandung`
  const fullUrl = `${SITE_URL}${url}`
  
  const defaultKeywords = [
    'konveksi bandung',
    'jasa pembuatan seragam',
    'seragam kantor',
    'seragam sekolah',
    'pakaian kerja',
    'konveksi jaket',
    'konveksi polo shirt',
    'baju seragam perusahaan',
    'konveksi murah bandung',
    'jasa jahit seragam'
  ]

  const allKeywords = [...defaultKeywords, ...keywords].join(', ')

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />
      <meta name="google-site-verification" content="your-google-verification-code" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="REVELATION Konveksi Bandung" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}
