import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} className="text-accent" />,
  error: <XCircle size={18} className="text-red-500" />,
  warning: <AlertCircle size={18} className="text-yellow-500" />,
  info: <Info size={18} className="text-primary" />,
};

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl px-4 py-3 border border-gray-100 dark:border-white/10 min-w-64 max-w-sm">
      {icons[type]}
      <p className="text-sm text-text-dark dark:text-text-light flex-1">{message}</p>
      <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10">
        <X size={14} className="text-gray-400" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    {toasts.map(t => (
      <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
    ))}
  </div>
);

export default Toast;
