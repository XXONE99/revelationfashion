"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLoadingOverlay from './AdminLoadingOverlay';
import AdminToast, { ToastNotification } from './AdminToast';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { User } from '@/entities/User';
import { hashPassword, isHashed } from '@/lib/password';
import { createClient } from '@/lib/supabase/client';

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
  const [resetCredentials, setResetCredentials] = useState({ username: '', newPassword: '', confirmPassword: '' });
  
  // Loading and notification states
  const [isLoading, setIsLoading] = useState(false);
  const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);
  
  const { settings, isLoading: settingsLoading, error: settingsError } = useAdminSettings();

  // Function to migrate legacy password to hashed password
  const migrateLegacyPassword = async (username: string, plainPassword: string) => {
    try {
      const hashedPassword = await hashPassword(plainPassword);
      const supabase = createClient();
      
      const { error } = await supabase
        .from('users')
        .update({ 
          password: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('username', username);

      if (error) {
        console.error('Error migrating password:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in migrateLegacyPassword:', error);
      return false;
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try database authentication first
      const user = await User.authenticate(loginCredentials.username, loginCredentials.password);
      
      if (user) {
        // Check if password is legacy (plain text) and migrate it
        if (!isHashed(user.password)) {
          console.log('Migrating legacy password to hashed format...');
          await migrateLegacyPassword(loginCredentials.username, loginCredentials.password);
        }
        
        localStorage.setItem('laksakarya_admin_token', 'authenticated');
        
        // Show success toast
        setToastNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Login Berhasil!',
          message: 'Selamat datang di Admin Panel. Anda akan diarahkan ke dashboard.',
          duration: 3000
        });

        // Redirect after success
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        // Fallback to localStorage credentials for backward compatibility
        const ADMIN_CREDENTIALS = getAdminCredentials();
        if (loginCredentials.username === ADMIN_CREDENTIALS.username && 
            loginCredentials.password === ADMIN_CREDENTIALS.password) {
          localStorage.setItem('laksakarya_admin_token', 'authenticated');
          
          // Show success toast
          setToastNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Login Berhasil!',
            message: 'Selamat datang di Admin Panel. Anda akan diarahkan ke dashboard.',
            duration: 3000
          });

          // Redirect after success
          setTimeout(() => {
            onLoginSuccess();
          }, 1000);
        } else {
          // Show error toast
          setToastNotification({
            id: Date.now().toString(),
            type: 'error',
            title: 'Login Gagal',
            message: 'Username atau password yang Anda masukkan salah. Silakan coba lagi.',
            duration: 4000
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setToastNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Login Gagal',
        message: 'Terjadi kesalahan saat memproses login. Silakan coba lagi.',
        duration: 4000
      });
    }
    
    setIsLoading(false);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (resetCredentials.newPassword !== resetCredentials.confirmPassword) {
        setToastNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Reset Password Gagal',
          message: 'Password baru tidak cocok. Silakan periksa kembali konfirmasi password.',
          duration: 4000
        });
        setIsLoading(false);
        return;
      }
      
      if (!resetCredentials.username || !resetCredentials.newPassword) {
        setToastNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Reset Password Gagal',
          message: 'Username dan Password baru tidak boleh kosong.',
          duration: 4000
        });
        setIsLoading(false);
        return;
      }

      // Check if username exists in database
      const existingUser = await User.findByUsername(resetCredentials.username);
      
      if (existingUser) {
        // Update password in database
        const success = await User.updatePassword(resetCredentials.username, resetCredentials.newPassword);
        
        if (success) {
          setToastNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Password Berhasil Direset!',
            message: 'Password telah diperbarui di database. Silakan login dengan kredensial yang baru.',
            duration: 4000
          });
          
          setResetCredentials({ username: '', newPassword: '', confirmPassword: '' });
          setView('login');
        } else {
          setToastNotification({
            id: Date.now().toString(),
            type: 'error',
            title: 'Reset Password Gagal',
            message: 'Gagal memperbarui password di database. Silakan coba lagi.',
            duration: 4000
          });
        }
      } else {
        // Username not found in database, show error
        setToastNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Username Tidak Ditemukan',
          message: 'Username yang Anda masukkan tidak ditemukan di database. Silakan periksa kembali.',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setToastNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Reset Password Gagal',
        message: 'Terjadi kesalahan saat memproses reset password. Silakan coba lagi.',
        duration: 4000
      });
    }
    
    setIsLoading(false);
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700" 
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              className="w-full" 
              onClick={() => { setView('reset'); }}
              disabled={isLoading}
            >
              Lupa atau ingin reset password?
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">Reset Password</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <Input 
                type="text" 
                value={resetCredentials.username} 
                onChange={(e) => setResetCredentials({...resetCredentials, username: e.target.value})} 
                placeholder="Masukkan username yang akan direset" 
                required 
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Reset Password'}
            </Button>
            <Button type="button" variant="link" className="w-full" onClick={() => { setView('login'); }}>Kembali ke Login</Button>
          </form>
        )}
      </div>
      
      {/* Loading Overlay */}
      <AdminLoadingOverlay 
        isVisible={isLoading}
        title={view === 'login' ? "Memproses Login..." : "Memproses Reset Password..."}
        message={view === 'login' ? "Mohon tunggu sebentar, sedang memverifikasi kredensial Anda." : "Mohon tunggu sebentar, sedang memperbarui password di database."}
      />
      
      {/* Toast Notification */}
      <AdminToast
        notification={toastNotification}
        onClose={() => setToastNotification(null)}
      />
    </div>
  );
}
