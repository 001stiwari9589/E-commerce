import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass =
    type === "success"
      ? "bg-emerald-600 dark:bg-emerald-700"
      : type === "error"
      ? "bg-red-600 dark:bg-red-700"
      : "bg-blue-600 dark:bg-blue-700";

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-in-right">
      <div className={`${bgClass} text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-medium transition-all duration-300 transform scale-100 hover:scale-105`}>
        {type === "success" && (
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {type === "error" && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {type === "info" && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:text-gray-200 focus:outline-none cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Toast;
