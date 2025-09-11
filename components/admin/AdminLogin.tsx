"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NotificationModal from './NotificationModal';
import { useAdminSettings } from '@/hooks/useAdminSettings';

const CREDENTIALS_KEY = 'laksakarya_admin_creds';

function getAdminCredentials() {
  const storedCreds = localStorage.getItem(CREDENTIALS_KEY);
  if (storedCreds) {
    return JSON.parse(storedCreds);
  }
  return { username: 'Revelation', password: 'RVLT01' };
}

export function checkAdminAuth() {
  return localStorage.getItem('laksakarya_admin_token') === 'authenticated';
}

export function logoutAdmin() {
  localStorage.removeItem('laksakarya_admin_token');
}

interface AdminLoginProps {
  onLoginSuccess: () => void
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [view, setView] = useState('login'); // 'login' or 'reset'
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [resetCredentials, setResetCredentials] = useState({ newUsername: '', newPassword: '', confirmPassword: '' });
  
  // Notification modal states
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'loading';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const { settings, isLoading: settingsLoading, error: settingsError } = useAdminSettings();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Show loading modal
    setNotification({
      isOpen: true,
      type: 'loading',
      title: 'Memproses Login...',
      message: 'Mohon tunggu sebentar, sedang memverifikasi kredensial Anda.'
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const ADMIN_CREDENTIALS = getAdminCredentials();
    if (loginCredentials.username === ADMIN_CREDENTIALS.username && 
        loginCredentials.password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('laksakarya_admin_token', 'authenticated');
      
      // Show success modal
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Login Berhasil!',
        message: 'Selamat datang di Admin Panel. Anda akan diarahkan ke dashboard.'
      });

      // Redirect after success
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } else {
      // Show error modal
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Login Gagal',
        message: 'Username atau password yang Anda masukkan salah. Silakan coba lagi.'
      });
    }
    
    setIsLoggingIn(false);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetCredentials.newPassword !== resetCredentials.confirmPassword) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Reset Password Gagal',
        message: 'Password baru tidak cocok. Silakan periksa kembali konfirmasi password.'
      });
      return;
    }
    if (!resetCredentials.newUsername || !resetCredentials.newPassword) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Reset Password Gagal',
        message: 'Username dan Password baru tidak boleh kosong.'
      });
      return;
    }
    
    const newCreds = {
      username: resetCredentials.newUsername,
      password: resetCredentials.newPassword
    };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(newCreds));
    
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Password Berhasil Direset!',
      message: 'Kredensial baru telah disimpan. Silakan login dengan username dan password yang baru.'
    });
    
    setResetCredentials({ newUsername: '', newPassword: '', confirmPassword: '' });
    setView('login');
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800/80 border border-transparent dark:border-white/10 rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden ring-2 ring-yellow-400/60">
            {settingsLoading ? (
              <div className="w-full h-full bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full" />
            ) : settings.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt="logo" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  console.error('❌ [ADMIN LOGIN] Failed to load logo:', settings.logo_url);
                  e.currentTarget.src = '/placeholder-logo.png';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-xs text-gray-500 dark:text-gray-300">Logo</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{settings.app_name}</h1>
          <p className="text-gray-600 dark:text-gray-300">Admin Panel</p>
        </div>

        {view === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <Input 
                type="text" 
                value={loginCredentials.username} 
                onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})} 
                placeholder="Masukkan username" 
                required 
                disabled={isLoggingIn}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <Input 
                type="password" 
                value={loginCredentials.password} 
                onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})} 
                placeholder="Masukkan password" 
                required 
                disabled={isLoggingIn}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Memproses...' : 'Login'}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              className="w-full" 
              onClick={() => { setView('reset'); }}
              disabled={isLoggingIn}
            >
              Lupa atau ingin reset password?
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">Reset Password</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username Baru</label>
              <Input 
                type="text" 
                value={resetCredentials.newUsername} 
                onChange={(e) => setResetCredentials({...resetCredentials, newUsername: e.target.value})} 
                placeholder="Masukkan username baru" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Baru</label>
              <Input 
                type="password" 
                value={resetCredentials.newPassword} 
                onChange={(e) => setResetCredentials({...resetCredentials, newPassword: e.target.value})} 
                placeholder="Masukkan password baru" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konfirmasi Password Baru</label>
              <Input 
                type="password" 
                value={resetCredentials.confirmPassword} 
                onChange={(e) => setResetCredentials({...resetCredentials, confirmPassword: e.target.value})} 
                placeholder="Konfirmasi password baru" 
                required 
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Reset Password</Button>
            <Button type="button" variant="link" className="w-full" onClick={() => { setView('login'); }}>Kembali ke Login</Button>
          </form>
        )}
      </div>
      
      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onConfirm={() => {
          if (notification.type === 'success' && notification.title === 'Login Berhasil!') {
            onLoginSuccess();
          }
          setNotification(prev => ({ ...prev, isOpen: false }));
        }}
        confirmText={notification.type === 'loading' ? 'Tunggu...' : 'OK'}
      />
    </div>
  );
}
