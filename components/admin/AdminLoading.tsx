"use client"

import React from 'react';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading Admin Panel...</p>
      </div>
    </div>
  );
}
