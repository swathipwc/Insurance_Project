import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 animate-in fade-in-0"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className={`relative z-50 grid w-full ${sizeClasses[size]} gap-4 border bg-white p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 rounded-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-sm font-semibold leading-none tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        
        {/* Body */}
        <div className="py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
