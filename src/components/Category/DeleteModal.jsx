import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl scale-in-center">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-red-50 rounded-lg text-red-600">
            <AlertTriangle size={24} />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900">Confirm Delete</h3>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          Are you sure you want to delete this category? This action cannot be undone. 
        </p>

        <div className="flex gap-3 mt-6">
          <button 
            disabled={loading}
            onClick={onClose} 
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={loading}
            onClick={onConfirm} 
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-100 hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;