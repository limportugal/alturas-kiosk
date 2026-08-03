import { useEffect, useState } from "react";
import { colors } from "@/Kiosk/utils/colors";
import { CartItem } from "@/Kiosk/types/cart-types";
import { formatMoney } from "@/Kiosk/components/shared";
import { ScrollHint } from "@/Kiosk/components/ScrollHint";

interface ResumeSessionModalProps {
    open: boolean;
    cartItems: CartItem[];
    onResume: () => void;
    onNew: () => void;
}

export function ResumeSessionModal({
    open,
    cartItems,
    onResume,
    onNew,
}: ResumeSessionModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [open]);

    if (!open) return null;

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1300,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.25s ease",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    width: 620,
                    zoom: 1.5,
                    maxWidth: "90vw",
                    overflow: "hidden",
                    boxShadow: "0 28px 70px rgba(0,0,0,0.28)",
                    transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                    transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease",
                    opacity: visible ? 1 : 0,
                }}
            >
                <div
                    style={{
                        background: colors.primary,
                        padding: "20px 28px",
                        textAlign: "center",
                    }}
                >
                    <p style={{ color: "#fff", fontSize: 20, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                        PREVIOUS ORDER FOUND
                    </p>
                </div>

                <ScrollHint scaleCompensation={1.5} scrollAreaStyle={{ maxHeight: 360, padding: "14px 0" }}>
                    {cartItems.map((item, index) => (
                        <div
                            key={`${item.product_id}-${item.color ?? "none"}-${index}`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                padding: "12px 28px",
                                borderBottom: index < cartItems.length - 1 ? "1px solid #f0ede8" : "none",
                            }}
                        >
                            {item.image ? (
                                <img
                                    src={`/${item.image}`}
                                    alt={item.name}
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 10,
                                        objectFit: "cover",
                                        flexShrink: 0,
                                        background: "#f5f3f0",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 10,
                                        background: "#f0ede8",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: "#777",
                                    }}
                                >
                                    NO IMAGE
                                </div>
                            )}

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {item.name}
                                </p>
                                {item.color && (
                                    <p style={{ fontSize: 14, color: "#888", margin: "2px 0 0" }}>{item.color}</p>
                                )}
                            </div>

                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <p style={{ fontSize: 18, color: "#000", margin: 0 }}>x{item.quantity}</p>
                                <p style={{ fontSize: 18, fontWeight: 700, color: colors.primary, margin: "2px 0 0", whiteSpace: "nowrap" }}>
                                    {formatMoney(item.subtotal)}
                                </p>
                            </div>
                        </div>
                    ))}
                </ScrollHint>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 28px",
                        background: "#faf9f7",
                        borderTop: "1px solid #f0ede8",
                        borderBottom: "1px solid #f0ede8",
                    }}
                >
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#888", letterSpacing: 1 }}>TOTAL</span>
                    <span style={{ fontSize: 26, fontWeight: 800, color: colors.primary, whiteSpace: "nowrap" }}>
                        {formatMoney(total)}
                    </span>
                </div>

                <div style={{ display: "flex", gap: 16, padding: "20px 28px" }}>
                    <button
                        onClick={onNew}
                        style={{
                            flex: 1,
                            padding: "16px 0",
                            borderRadius: 12,
                            border: "2px solid #e0dbd5",
                            background: "#fff",
                            color: "#555",
                            fontSize: 18,
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Start New
                    </button>
                    <button
                        onClick={onResume}
                        style={{
                            flex: 2,
                            padding: "16px 0",
                            borderRadius: 12,
                            border: "none",
                            background: colors.primary,
                            color: "#fff",
                            fontSize: 18,
                            fontWeight: 700,
                            cursor: "pointer",
                            letterSpacing: 0.5,
                        }}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

