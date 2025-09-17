"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileX, Server } from "lucide-react"
import Link from "next/link"

export default function ErrorDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Error Pages Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test all the error pages we've created
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 404 Error */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">404 Error</CardTitle>
              <CardDescription>
                Page not found with robot illustration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/404">View 404 Page</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/404">Admin 404 Page</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* No Data Found */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                <FileX className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-xl">No Data Found</CardTitle>
              <CardDescription>
                Empty state with broken paper illustration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/no-data">View No Data Page</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/no-data">Admin No Data Page</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Server Error */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">Server Error</CardTitle>
              <CardDescription>
                Internal server error with server illustration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/server-error">View Server Error Page</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/server-error">Admin Server Error Page</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Automatic Error Pages</CardTitle>
              <CardDescription>
                These pages are automatically triggered by Next.js
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Global Error Pages</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    These are automatically used by Next.js when errors occur
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">app/not-found.tsx</code>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">→ 404 errors</span>
                    </div>
                    <div className="text-sm">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">app/error.tsx</code>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">→ Server errors</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Admin Error Pages</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    These are automatically used in admin routes
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">app/admin/not-found.tsx</code>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">→ Admin 404</span>
                    </div>
                    <div className="text-sm">
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">app/admin/error.tsx</code>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">→ Admin errors</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
