import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeWidths = {
    sm: 'w-[min(90vw,384px)]',
    md: 'w-[min(90vw,500px)]',
    lg: 'w-[min(90vw,640px)]',
    xl: 'w-[min(90vw,768px)]',
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeWidths[size]} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all duration-300 max-h-[90vh] flex flex-col overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 flex-shrink-0">
          <h3 id="modal-title" className="text-lg font-semibold font-heading text-text-dark dark:text-text-light">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
};

export default Modal;