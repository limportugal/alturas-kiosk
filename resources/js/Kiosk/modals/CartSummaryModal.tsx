import { useState, useEffect } from "react";
import { useCart } from "@/Kiosk/hooks/useCart";
import { colors } from "@/Kiosk/utils/colors";
import { ProductItem } from "@/Kiosk-Admin/types/product-type";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
    "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2 });

interface CartSummaryModalProps {
    open: boolean;
    onClose: () => void;
    onPlaceOrder?: () => void;
    product?: ProductItem | null;
    selectedColor?: string | null;
}

export function CartSummaryModal({product, selectedColor, open, onClose, onPlaceOrder }: CartSummaryModalProps) {
    const {
        cartItems,
        getTotalAmount,
        removeItem,
        updateQty,
        confirmCart,
        clearCart,
    } = useCart();

    const [visible, setVisible]   = useState(false);
    const [ordered, setOrdered]   = useState(false);

    const totalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = getTotalAmount();

    // const displayImage = product?.color_variants?.find(
    //     (v) => v.color_name == selectedColor
    // )?.image_path ?? product?.images?.[0];

    useEffect(() => {
        if (open) {
            setOrdered(false);
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [open]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handlePlaceOrder = async () => {
        setOrdered(true);
        try {
            await confirmCart();
            onPlaceOrder?.();
        } catch {
            // Still close so the user isn't stuck on the modal
        }
        setTimeout(() => {
            handleClose();
        }, 1800);
    };

    if (!open) return null;

    return (
        <div
            onClick={handleClose}
            style={{
                position: "fixed", inset: 0, zIndex: 1100,
                background: "rgba(0,0,0,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.25s ease",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    width: 720,
                    maxWidth: "92vw",
                    maxHeight: "86vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
                    transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease",
                    opacity: visible ? 1 : 0,
                    boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
                }}
            >
                {/* Header */}
                <div style={{ background: colors.primary, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>ORDER SUMMARY</span>
                        <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 20, fontSize: 13, fontWeight: 700, padding: "2px 12px" }}>
                            {totalCount} {totalCount === 1 ? "item" : "items"}
                        </span>
                    </div>
                    <button onClick={handleClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>

                {/* Items list */}
                <div style={{ flex: 1, overflowY: "auto", padding: cartItems.length > 0 ? "0" : "48px 32px" }}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: "center" }}>
                            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
                                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 01-8 0" />
                                </svg>
                            </div>
                            <p style={{ fontSize: 18, fontWeight: 700, color: "#aaa", margin: 0 }}>Your cart is empty</p>
                        </div>
                    ) : (
                        cartItems.map((item, idx) => (
                            <div
                                key={`${item.product_id}-${item.color ?? "default"}`}
                                style={{
                                    display: "flex", gap: 20,
                                    padding: "20px 32px",
                                    borderBottom: idx < cartItems.length - 1 ? "1px solid #f0ede8" : "none",
                                    alignItems: "center",
                                }}
                            >
                                {/* Image */}
                                {item.image ? (
                                    <img src={`/${item.image}`} alt={item.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: "#f5f3f0" }} />
                                ) : (
                                    <div style={{ width: 72, height: 72, borderRadius: 10, background: "#f0ede8", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🛋️</div>
                                )}

                                {/* Name + color */}
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>{item.name}</p>
                                    {item.color && (
                                        <p style={{ fontSize: 12, color: "#888", margin: "0 0 4px" }}>Color: {item.color}</p>
                                    )}
                                    <p style={{ fontSize: 14, fontWeight: 600, color: colors.primary, margin: 0 }}>{fmt(item.price)} each</p>
                                </div>

                                {/* Quantity controls */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <button
                                        onClick={() => {
                                            if (item.quantity - 1 <= 0) {
                                                removeItem(item.product_id, item.color ?? null);
                                            } else {
                                                updateQty(item.product_id, item.color ?? null, item.quantity - 1);
                                            }
                                        }}
                                        disabled={item.quantity <= 1}
                                        style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${item.quantity <= 1 ? '#ddd' : colors.primary}`, background: "#fff", color: item.quantity <= 1 ? '#ddd' : colors.primary, fontSize: 18, fontWeight: 700, cursor: item.quantity <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >−</button>
                                    <span style={{ fontSize: 16, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQty(item.product_id, item.color ?? null, item.quantity + 1)}
                                        style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${colors.primary}`, background: "#fff", color: colors.primary, fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >+</button>
                                </div>

                                {/* Line total */}
                                <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", minWidth: 90, textAlign: "right", margin: 0 }}>
                                    {fmt(item.subtotal)}
                                </p>

                                {/* Remove */}
                                <button
                                    onClick={() => removeItem(item.product_id, item.color ?? null)}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 20, padding: 4, display: "flex", alignItems: "center" }}
                                    aria-label="Remove item"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div style={{ borderTop: "1px solid #f0ede8", padding: "24px 32px", background: "#faf9f7", flexShrink: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 12, color: "#999", margin: "0 0 2px", letterSpacing: 1 }}>TOTAL AMOUNT</p>
                                <p style={{ fontSize: 32, fontWeight: 800, color: colors.primary, margin: 0 }}>{fmt(totalPrice)}</p>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <button
                                    onClick={clearCart}
                                    style={{ padding: "14px 24px", borderRadius: 12, border: "2px solid #ddd", background: "#fff", color: "#666", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={ordered}
                                    style={{
                                        background: ordered ? "#22c55e" : colors.primary,
                                        color: "#fff", border: "none", borderRadius: 12,
                                        padding: "14px 40px", fontSize: 15, fontWeight: 700,
                                        letterSpacing: 1.5, cursor: ordered ? "default" : "pointer",
                                        transition: "background 0.25s ease",
                                        display: "flex", alignItems: "center", gap: 8,
                                    }}
                                >
                                    {ordered ? "✓ ORDER PLACED!" : "PLACE ORDER"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
