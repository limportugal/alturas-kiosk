import { create } from 'zustand';

interface Toast {
    id: string;
    message: string;
    type?: "success" | "error" | "info" ;
    duration?: number;
}

interface ToastState {
    toasts: Toast[];
    showToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

export const useToast = create<ToastState>((set) => ({
    toasts: [],
    showToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));
        // remove toast after duration
         setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
         }, toast.duration || 3000);
    },
    // remove toast manually
    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    }
}));