import { ToastContainer } from "@/Kiosk-Admin/components/toast";

interface ToastProviderProps {
    children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    return (
        <>
            {children}
            <ToastContainer />
        </>
    );
} 