import { useEffect, useState } from "react";
import { colors } from "@/Kiosk/utils/colors";
import { CartItem } from "@/Kiosk/types/cart-types";
import { formatMoney } from "@/Kiosk/components/shared";

interface ResumeSessionModalProps {
    open:      boolean;
    cartItems: CartItem[];
    onResume:  () => void;
    onNew:     () => void;
}

export function ResumeSessionModal({
    open,
    cartItems,
    onResume,
    onNew,
}: ResumeSessionModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) requestAnimationFrame(() => setVisible(true));
        else setVisible(false);
    }, [open]);

    if (!open) return null;

    const total = cartItems.reduce((sum, i) => sum + i.subtotal, 0);

    return (
        <div
            style={{
                position:       "fixed",
                inset:          0,
                zIndex:         1300,
                background:     "rgba(0,0,0,0.6)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                opacity:        visible ? 1 : 0,
                transition:     "opacity 0.25s ease",
            }}
        >
            <div
                style={{
                    background:   "#fff",
                    borderRadius: 24,
                    width:        560,
                    maxWidth:     "90vw",
                    overflow:     "hidden",
                    boxShadow:    "0 28px 70px rgba(0,0,0,0.28)",
                    transform:    visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                    transition:   "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease",
                    opacity:      visible ? 1 : 0,
                }}
            >
                {/* Header */}
                <div style={{
                    background:  colors.primary,
                    padding:     "20px 28px",
                    textAlign:   "center",
                }}>
                    <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, letterSpacing: 1.5, margin: 0 }}>
                        PREVIOUS SESSION FOUND
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "6px 0 0" }}>
                        You left {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
                    </p>
                </div>

                {/* Cart items list */}
                <div style={{ maxHeight: 320, overflowY: "auto", padding: "16px 0" }}>
                    {cartItems.map((item, i) => (
                        <div
                            key={`${item.product_id}-${item.color ?? "none"}-${i}`}
                            style={{
                                display:       "flex",
                                alignItems:    "center",
                                gap:           16,
                                padding:       "10px 24px",
                                borderBottom:  i < cartItems.length - 1 ? "1px solid #f0ede8" : "none",
                            }}
                        >
                            {/* Image */}
                            {item.image ? (
                                <img
                                    src={`/${item.image}`}
                                    alt={item.name}
                                    style={{
                                        width:        52,
                                        height:       52,
                                        borderRadius: 8,
                                        objectFit:    "cover",
                                        flexShrink:   0,
                                        background:   "#f5f3f0",
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width:          52,
                                    height:         52,
                                    borderRadius:   8,
                                    background:     "#f0ede8",
                                    flexShrink:     0,
                                    display:        "flex",
                                    alignItems:     "center",
                                    justifyContent: "center",
                                    fontSize:       22,
                                }}>🛋️</div>
                            )}

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {item.name}
                                </p>
                                {item.color && (
                                    <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>{item.color}</p>
                                )}
                            </div>

                            {/* Qty × price */}
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <p style={{ fontSize: 13, color: "#888", margin: 0 }}>×{item.quantity}</p>
                                <p style={{ fontSize: 15, fontWeight: 700, color: colors.primary, margin: "2px 0 0" }}>
                                    {formatMoney(item.subtotal)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div style={{
                    display:         "flex",
                    justifyContent:  "space-between",
                    alignItems:      "center",
                    padding:         "14px 24px",
                    background:      "#faf9f7",
                    borderTop:       "1px solid #f0ede8",
                    borderBottom:    "1px solid #f0ede8",
                }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#888", letterSpacing: 1 }}>TOTAL</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: colors.primary }}>{formatMoney(total)}</span>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 12, padding: "20px 24px" }}>
                    <button
                        onClick={onNew}
                        style={{
                            flex:         1,
                            padding:      "16px 0",
                            borderRadius: 12,
                            border:       "2px solid #e0dbd5",
                            background:   "#fff",
                            color:        "#555",
                            fontSize:     15,
                            fontWeight:   600,
                            cursor:       "pointer",
                        }}
                    >
                        Start New
                    </button>
                    <button
                        onClick={onResume}
                        style={{
                            flex:          2,
                            padding:       "16px 0",
                            borderRadius:  12,
                            border:        "none",
                            background:    colors.primary,
                            color:         "#fff",
                            fontSize:      15,
                            fontWeight:    700,
                            cursor:        "pointer",
                            letterSpacing: 0.5,
                        }}
                    >
                        Resume Session
                    </button>
                </div>
            </div>
        </div>
    );
}
