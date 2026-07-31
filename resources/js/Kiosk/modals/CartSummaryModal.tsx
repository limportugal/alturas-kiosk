import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useCart } from "@/Kiosk/hooks/useCart";
import { colors } from "@/Kiosk/utils/colors";
import { ConfirmActionModal } from "@/Kiosk/modals/ConfirmActionModal";
import { CartItem } from "@/Kiosk/types/cart-types";
import { RemoveIcon } from "@/Kiosk/components/UI/RemoveIcon";
import { formatMoney } from "@/Kiosk/components/shared"
import { typography } from "@/Kiosk/utils/typography";
// import { generateReceiptFromCart, printReceipt } from "@/Kiosk/utils/receiptPrinter";
 


interface CartSummaryModalProps {
    open: boolean;
    onClose: () => void;
    onPlaceOrder?: () => void;
}

// ─── Trash icon ───────────────────────────────────────────────────────────────
const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export function CartSummaryModal({ open, onClose, onPlaceOrder }: CartSummaryModalProps) {
    const { cartItems, getTotalAmount, removeItem, updateQty, confirmCart, clearCart } = useCart();

    const [visible, setVisible] = useState(false);
    const [ordered, setOrdered] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [placeOrderError, setPlaceOrderError] = useState("");
    const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
    const [removeTarget, setRemoveTarget] = useState<{ product_id: number; color: string | null; name: string } | null>(null);
    const [placeConfirmOpen, setPlaceConfirmOpen] = useState(false);
   

    const totalCount = cartItems.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
    const totalPrice = getTotalAmount();

    // ── Group items by product name ───────────────────────────────────────────
    // Same product, different colors → grouped under one header
    const grouped = useMemo(() => {
        const map = new Map<string, CartItem[]>();
        cartItems.forEach((item: CartItem) => {
            const key = item.name;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(item);
        });
        return Array.from(map.entries());
    }, [cartItems]);

    useEffect(() => {
        if (open) {
            setOrdered(false);
            setPlacingOrder(false);
            setPlaceOrderError("");
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [open]); 


    useEffect(() => {
        if (open && cartItems.length === 0) {
            handleClose();
        }
    }, [cartItems.length, open]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handlePlaceOrder = async () => {
        if (placingOrder) {
            return;
        }

        setPlacingOrder(true);
        setPlaceOrderError("");

        try {
            const result = await confirmCart();

            if (!result?.data) {
                throw new Error("Unable to confirm the cart.");
            }

            // const receiptContent = generateReceiptFromCart(result.data);
            // printReceipt(receiptContent);

            setOrdered(true);

            if (onPlaceOrder) {
                onPlaceOrder();
            } else {
                handleClose();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const stockError = error.response?.data?.errors?.stock?.[0];
                const message = error.response?.data?.message;
                setPlaceOrderError(stockError || message || "Unable to place the order.");
            } else {
                setPlaceOrderError(error instanceof Error ? error.message : "Unable to place the order.");
            }
        } finally {
            setPlacingOrder(false);
        }
    };

    const handleIncrease = (item: CartItem) => {
        if (typeof item.stock !== "number") {
            return;
        }

        if (item.quantity >= item.stock) {
            return;
        }

        void updateQty(item.product_id, item.color ?? null, item.quantity + 1);
    };

    if (!open) return null;

    return (
        <>
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
                    borderRadius: 24,
                    width: 920,
                    maxWidth: "94vw",
                    maxHeight: "88vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
                    transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease",
                    opacity: visible ? 1 : 0,
                    boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
                }}
            >
                {/* ── Header ── */}
                <div style={{ background: colors.primary, padding: "26px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        <span style={{ color: "#fff", fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>ORDER SUMMARY</span>
                        <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 24, fontSize: 18, fontWeight: 700, padding: "4px 16px" }}>
                            {totalCount} {totalCount === 1 ? "item" : "items"}
                        </span>
                    </div>
                    <button
                        onClick={handleClose} 
                        style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 50, height: 50, cursor: "pointer", color: "#fff", fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >×</button>
                </div>

                {/* ── Items list ── */}
                <div style={{ flex: 1, overflowY: "auto", padding: cartItems.length > 0 ? 0 : "48px 32px" }}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: "center" }}>
                            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
                                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <path d="M16 10a4 4 0 01-8 0"/>
                                </svg>
                            </div>
                            <p style={{ fontSize: 18, fontWeight: 700, color: "#aaa", margin: 0 }}>Your cart is empty</p>
                        </div>
                    ) : (
                        grouped.map(([productName, variants]) => {
                            const groupSubtotal     = variants.reduce((s: number, i: CartItem) => s + i.subtotal, 0);
                            const hasMultipleColors = variants.length > 1;

                            return (
                                <div key={productName}>
                                    {/* ── Group header ── */}
                                    <div style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "16px 40px 14px",
                                        background: "rgba(107,47,160,0.05)",
                                        borderTop: "1px solid #f0ede8",
                                        borderBottom: "1px solid rgba(107,47,160,0.1)",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1.5, color: colors.primary }}>
                                                {productName}
                                            </span>
                                            {hasMultipleColors && (
                                                <span style={{ background: colors.primary, color: "#fff", fontSize: 14, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                                                    {variants.length} colors
                                                </span>
                                            )}
                                        </div>
                                        {hasMultipleColors && (
                                            <span style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>
                                                Subtotal: {formatMoney(groupSubtotal)}
                                            </span>
                                        )}
                                    </div>

                                    {/* ── Variant rows ── */}
                                    {variants.map((item, idx) => (
                                        (() => {
                                            const canIncrease = item.stock == null || item.quantity < item.stock;

                                            return (
                                                <div
                                                    key={`${item.product_id}-${item.color ?? "none"}`}
                                                    style={{
                                                        display: "flex", gap: 30,
                                                        padding: "24px 40px",
                                                        borderBottom: idx < variants.length - 1 ? "1px solid #f9f7f5" : "none",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {/* Image */}
                                                    {item.image ? (
                                                        <img
                                                            src={`/${item.image}`}
                                                            alt={item.name}
                                                            style={{ width: 100, height: 100, borderRadius: 14, objectFit: "cover", flexShrink: 0, background: "#f5f3f0" }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: 100, height: 100, borderRadius: 14, background: "#f0ede8", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🛋️</div>
                                                    )}

                                                    {/* Info */}
                                                    <div style={{ flex: 1 }}>
                                                        {item.color ? (
                                                            <p style={{ fontSize: 22, color: "#333", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
                                                                {item.color}
                                                            </p>
                                                        ) : (
                                                            <p style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>{item.name}</p>
                                                        )}
                                                        <p style={{ fontSize: 24, fontWeight: 600, color: colors.primary, margin: 0 }}>{formatMoney(item.price)} each</p>
                                                    </div>

                                                    {/* Quantity controls */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                        <button
                                                            onClick={() => {
                                                                if (item.quantity - 1 <= 0) {
                                                                    removeItem(item.product_id, item.color ?? null);
                                                                } else {
                                                                    updateQty(item.product_id, item.color ?? null, item.quantity - 1);
                                                                }
                                                            }}
                                                            disabled={item.quantity <= 1}
                                                            style={{
                                                                width: 56, height: 56, borderRadius: 12,
                                                                border: `2px solid ${item.quantity <= 1 ? "#ddd" : colors.primary}`,
                                                                background: "#fff",
                                                                color: item.quantity <= 1 ? "#ddd" : colors.primary,
                                                                fontSize: 26, fontWeight: 700,
                                                                cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                            }}
                                                        >−</button>
                                                        <span style={{ fontSize: 26, fontWeight: 700, minWidth: 40, textAlign: "center" }}>{item.quantity}</span>
                                                        <button
                                                            disabled={!canIncrease}
                                                            onClick={() => canIncrease && handleIncrease(item)}
                                                            style={{
                                                                width: 56, height: 56, borderRadius: 12,
                                                                border: `2px solid ${canIncrease ? colors.primary : "#ddd"}`,
                                                                background: "#fff", color: canIncrease ? colors.primary : "#ddd",
                                                                fontSize: 26, fontWeight: 700, cursor: canIncrease ? "pointer" : "not-allowed",
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                            }}
                                                        >+</button>
                                                    </div>

                                                    {/* Line total */}
                                                    <p style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", minWidth: 150, textAlign: "right", margin: 0 }}>
                                                        {formatMoney(item.subtotal)}
                                                    </p>

                                                    {/* Remove */}
                                                    <button
                                                        onClick={() => setRemoveTarget({ product_id: item.product_id, color: item.color ?? null, name: item.name })}
                                                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 0, display: "flex", alignItems: "center" }}
                                                        aria-label={`Remove ${item.name} ${item.color ?? ""}`}
                                                    >
                                                        <RemoveIcon
                                                            filled
                                                            color="#ef4444"
                                                            size={48}                   
                                                        />
                                                    </button>
                                                </div>
                                            );
                                        })()
                                    ))}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ── Footer ── */}
                {cartItems.length > 0 && (
                    <div style={{ borderTop: "1px solid #f0ede8", padding: "36px 48px", background: "#faf9f7", flexShrink: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: 20 }}>
                                <button
                                    onClick={() => setPlaceConfirmOpen(true)}
                                    disabled={ordered || placingOrder}
                                    style={{
                                        background: ordered ? "#22c55e" : colors.primary,
                                        color: "#fff", border: "none", borderRadius: 16, 
                                        padding: "22px 50px", fontSize: 22, fontWeight: 700,
                                        letterSpacing: 1.5, cursor: ordered || placingOrder ? "default" : "pointer",
                                        transition: "background 0.25s ease",
                                        display: "flex", alignItems: "center", gap: 10,
                                    }}
                                >
                                    {ordered ? "✓ ORDER PLACED!" : "PLACE ORDER"}
                                </button>
                                <button
                                    onClick={() => setClearConfirmOpen(true)}
                                    style={{ padding: "22px 36px", borderRadius: 16, border: "2px solid #ddd", background: "#fff", color: "#666", fontSize: 20, fontWeight: 600, cursor: "pointer" }}
                                >
                                    Clear All
                                </button>
                            </div>

                            <div style={{ marginLeft: 48, textAlign: "right" }}>
                                <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#666", letterSpacing: 1.5 }}>TOTAL AMOUNT</p>
                                <p style={{ fontSize: 46, fontWeight: 800, color: colors.primary, margin: 0 }}>{formatMoney(totalPrice)}</p>
                            </div>
                        </div>
                        {placeOrderError && (
                            <p style={{ margin: "14px 0 0", color: "#dc2626", fontSize: 14, fontWeight: 600 }}>
                                {placeOrderError}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* ---- Place Order ----*/}
        <ConfirmActionModal
            open={placeConfirmOpen}
            title="Place Order"
            message="Are you sure you want to place this order?"
            confirmLabel="Yes, Place Order"
            cancelLabel="Cancel"
            onConfirm={() => {
                setPlaceConfirmOpen(false);
                handlePlaceOrder();
            }}
            onClose={() => setPlaceConfirmOpen(false)}
        />

        {/* ── Clear All confirmation ── */}
        <ConfirmActionModal
            open={clearConfirmOpen}
            title="Clear Cart"
            message="Are you sure you want to remove all items from your cart?"
            confirmLabel="Yes, Clear All"
            cancelLabel="Cancel"
            confirmTone="danger"
            onConfirm={() => {
                setClearConfirmOpen(false);
                clearCart();
                handleClose();
            }}
            onClose={() => setClearConfirmOpen(false)}
        />

        {/* ── Remove item confirmation ── */}
        <ConfirmActionModal
            open={removeTarget !== null}
            title="Remove Item"
            message={`Remove ${removeTarget?.name}${removeTarget?.color ? ` (${removeTarget.color})` : ""} from your cart?`}
            confirmLabel="Yes, Remove"
            cancelLabel="Cancel"
            confirmTone="danger"
            onConfirm={() => removeItem(removeTarget!.product_id, removeTarget!.color)}
            onClose={() => setRemoveTarget(null)}
        />
        </>
    );
}
