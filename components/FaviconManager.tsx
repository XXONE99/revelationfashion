"use client";

import { useFavicon } from '@/hooks/useFavicon';

export function FaviconManager() {
  useFavicon();
  return null; // This component doesn't render anything
}
