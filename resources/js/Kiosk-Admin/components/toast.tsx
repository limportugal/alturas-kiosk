import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, CheckCircle, Info, AlertCircle } from "lucide-react"; 

const icons = {
    success: <CheckCircle className="text-green-500 h-4 w-4" />,
    error: <AlertCircle className="text-red-500 h-4 w-4" />,
    info: <Info className="text-blue-500 h-4 w-4" />,
}

export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return createPortal(
        <div className="fixed z-[9999] top-5 right-5 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 w-72"
            >
              {icons[toast.type || "info"]}
              <span className="text-sm text-gray-800 flex-1">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)}>
                <X className="w-4 h-4 text-gray-500 hover:text-gray-800" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>,
      document.body
    )
}

