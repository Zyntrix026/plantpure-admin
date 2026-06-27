import React from 'react';
import { AlertTriangle, Ban, ShieldCheck, X } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading, 
  title, 
  description, 
  confirmText, 
  variant = "danger" // "danger" (Red for delete) ya "warning" (Amber for suspend) ya "success" (Green for unsuspend)
}) => {
  if (!isOpen) return null;

  // Variant ke hisab se icon aur colors adjust karne ke liye logic
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return {
          bg: "bg-amber-50 text-amber-600",
          button: "bg-amber-500 hover:bg-amber-600 shadow-amber-100",
          icon: <Ban size={24} />
        };
      case "success":
        return {
          bg: "bg-emerald-50 text-emerald-600",
          button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100",
          icon: <ShieldCheck size={24} />
        };
      case "danger":
      default:
        return {
          bg: "bg-red-50 text-red-600",
          button: "bg-red-500 hover:bg-red-600 shadow-red-100",
          icon: <AlertTriangle size={24} />
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl scale-in-center">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${styles.bg}`}>
            {styles.icon}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          {description}
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
            className={`flex-1 px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-lg transition-all disabled:opacity-50 ${styles.button}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;