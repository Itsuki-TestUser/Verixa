import React, { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

let toastId = 0;
let addToastFn = null;

export const toast = {
  success: (message) => addToastFn?.({ type: "success", message }),
  error: (message) => addToastFn?.({ type: "error", message }),
  warning: (message) => addToastFn?.({ type: "warning", message }),
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, message }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  const bgColors = {
    success:
      "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30",
    error: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30",
    warning:
      "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30",
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-right duration-300 ${bgColors[t.type]}`}
        >
          {icons[t.type]}
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {t.message}
          </p>
          <button
            onClick={() => removeToast(t.id)}
            className="p-1 rounded hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
