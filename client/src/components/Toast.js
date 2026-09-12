import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-[#1e3a8a]';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'i';

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slideIn">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold">
          {icon}
        </div>
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-auto text-white hover:text-gray-200 text-xl">
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;