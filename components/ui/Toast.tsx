import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    error: 'bg-red-100 border-red-200 text-red-800',
    info: 'bg-blue-100 border-blue-200 text-blue-800',
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-bottom-5 fade-in z-50 ${styles[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;