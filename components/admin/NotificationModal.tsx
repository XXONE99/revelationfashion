"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'loading';
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  showCancel?: boolean;
}

export default function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = 'OK',
  showCancel = false
}: NotificationModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />;
      case 'loading':
        return <Loader2 className="w-12 h-12 text-emerald-600 mx-auto mb-2 animate-spin" />;
      default:
        return null;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'loading':
        return 'text-emerald-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="text-center">
          <div className="py-2">
            {getIcon()}
            <DialogTitle className={`text-lg font-semibold ${getTitleColor()}`}>
              {title}
            </DialogTitle>
            <p className="text-gray-600 mt-1 text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </DialogHeader>
        
        <div className="flex justify-center gap-2 pt-2">
          {showCancel && (
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-sm"
            >
              Batal
            </Button>
          )}
          <Button
            onClick={onConfirm || onClose}
            className={`px-4 py-2 text-sm ${
              type === 'success' 
                ? 'bg-green-600 hover:bg-green-700' 
                : type === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
