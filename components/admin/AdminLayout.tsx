"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, Users, MessageSquare, Palette, Briefcase, Home as HomeIcon, 
  Menu, LogOut, Phone, Settings, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { logoutAdmin } from "./AdminLogin";
import AdminLoadingOverlay from './AdminLoadingOverlay';
import AdminToast, { ToastNotification } from './AdminToast';
import { useAdminSettings } from '@/hooks/useAdminSettings';

interface AdminLayoutProps {
  children: React.ReactNode
  sections: Record<string, { title: string; component: React.ComponentType }>
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function AdminLayout({ children, sections, activeSection, setActiveSection }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { settings, isLoading: settingsLoading, error: settingsError } = useAdminSettings();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Show loading for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    logoutAdmin();
    
    // Show success toast
    setToastNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Logout Berhasil!',
      message: 'Anda telah berhasil keluar dari Admin Panel.',
      duration: 2000
    });
    
    // Redirect after showing toast
    setTimeout(() => {
      router.push("/admin");
    }, 1000);
  };

  const navItems = [
    { key: "home-page", icon: HomeIcon, label: "Halaman Utama" },
    { key: "about-page", icon: FileText, label: "Tentang Kami" },
    { key: "products", icon: ShoppingBag, label: "Portofolio" },
    { key: "project-posts", icon: Briefcase, label: "Client & Proyek" },
    { key: "testimonials", icon: MessageSquare, label: "Testimoni" },
    { key: "color-catalogs", icon: Palette, label: "Katalog Warna" },
    { key: "contact", icon: Phone, label: "Informasi Kontak" },
    { key: "app-settings", icon: Settings, label: "Pengaturan Aplikasi" },
  ];

  const currentSectionTitle = navItems.find(item => item.key === activeSection)?.label || 'Admin Dashboard';

  return (
    <div className="flex h-screen bg-emerald-50/40 dark:bg-gray-900">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 dark:from-gray-800 dark:to-gray-900 text-white flex-col transition-transform duration-300 transform hidden lg:flex ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`}>
        <div className="h-16 flex items-center justify-center px-4 bg-emerald-900/60 dark:bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-yellow-400/60">
              {settingsLoading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse rounded-full" />
              ) : settings.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt="logo" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    console.error('❌ [ADMIN LAYOUT] Failed to load logo:', settings.logo_url);
                    e.currentTarget.src = '/placeholder-logo.png';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Logo</span>
                </div>
              )}
            </div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.key
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-emerald-50/80 hover:bg-emerald-700/60 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="px-4 py-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 mb-2 text-emerald-50/80 hover:bg-emerald-700/60 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => window.open('/', '_blank')}
          >
            <HomeIcon className="w-5 h-5"/>
            Lihat Website
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-emerald-50/80 hover:bg-emerald-700/60 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5"/>
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto pb-16 lg:pb-0">
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-gray-900/70 backdrop-blur shadow-sm border-b h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold capitalize hidden sm:block">{currentSectionTitle}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:inline">Welcome, Admin</span>
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-gray-800" />}
              </Button>
            )}
            <Button 
              variant="outline" 
              className="lg:hidden"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4"/>
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>

       {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/80 backdrop-blur border-t border-gray-200 dark:border-white/10 shadow-t-lg z-40">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 4).map((item) => ( // Show first 4 items
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 w-full ${
                activeSection === item.key
                  ? "text-emerald-600"
                  : "text-gray-600 dark:text-gray-300 hover:text-emerald-600"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-300 w-full"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">Lainnya</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 dark:from-gray-800 dark:to-gray-900 text-white flex flex-col transition-transform duration-300 transform lg:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
         <div className="h-16 flex items-center justify-center px-4 bg-emerald-900/60 dark:bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-yellow-400/60">
              {settingsLoading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse rounded-full" />
              ) : settings.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt="logo" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    console.error('❌ [ADMIN LAYOUT] Failed to load logo:', settings.logo_url);
                    e.currentTarget.src = '/placeholder-logo.png';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Logo</span>
                </div>
              )}
            </div>
            <h1 className="text-lg font-bold">Admin Menu</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => {
                setActiveSection(item.key);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.key
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-emerald-50/80 hover:bg-emerald-700/60 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      
      {/* Loading Overlay */}
      <AdminLoadingOverlay 
        isVisible={isLoggingOut}
        title="Memproses Logout..."
        message="Mohon tunggu sebentar, sedang memproses logout."
      />
      
      {/* Toast Notification */}
      <AdminToast
        notification={toastNotification}
        onClose={() => setToastNotification(null)}
      />
    </div>
  );
}
