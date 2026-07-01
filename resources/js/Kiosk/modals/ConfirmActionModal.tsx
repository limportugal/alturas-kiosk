import { useEffect, useState } from "react";
import { colors } from "@/Kiosk/utils/colors";

interface ConfirmActionModalProps {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmTone?: "primary" | "danger";
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
    onCancel?: () => void;
}

export function ConfirmActionModal({
    open,
    title = "Confirm Action",
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmTone = "primary",
    onConfirm,
    onClose,
    onCancel,
}: ConfirmActionModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [open]);

    if (!open) return null;

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 220);
    };

    const handleConfirm = async () => {
        onConfirm();
        handleClose();
    };

    const confirmBackground =
        confirmTone === "danger" ? "#dc2626" : colors.primary;

    return (
        <div
            onClick={handleClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1200,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.22s ease",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 560,
                    maxWidth: "88vw",
                    background: "#fff",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow: "0 28px 70px rgba(0,0,0,0.24)",
                    transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
                    transition: "transform 0.22s ease, opacity 0.22s ease",
                }}
            >
                <div
                    style={{
                        background: colors.primary,
                        color: "#fff",
                        padding: "18px 24px",
                        fontSize: 20,
                        fontWeight: 800,
                        letterSpacing: 1.5,
                        textAlign: "center",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        padding: "32px 28px",
                        textAlign: "center",
                        fontSize: 22,
                        lineHeight: 1.55,
                        fontWeight: 600,
                        color: "#000000ff",
                    }}
                >
                    {message}
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 14,
                        padding: "0 28px 28px",
                    }}
                >
                    <button
                        onClick={onCancel ? () => { onCancel(); handleClose(); } : handleClose}
                        style={{
                            flex: 1,
                            padding: "16px 20px",
                            borderRadius: 12,
                            border: "2px solid #d4d4d4",
                            background: "#fff",
                            color: "#555",
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        style={{
                            flex: 1,
                            padding: "16px 20px",
                            borderRadius: 12,
                            border: "none",
                            background: confirmBackground,
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: 800,
                            letterSpacing: 1,
                            cursor: "pointer",
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
