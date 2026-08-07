import { useState, useEffect } from "react";
import { useCart } from "@/Kiosk/hooks/useCart";
import { colors } from "@/Kiosk/utils/colors";
import { ProductItem } from "@/Kiosk-Admin/types/product-type";
import { Spinner } from "@/Kiosk/components/Spinner";
import { formatMoney } from "@/Kiosk/components/shared";
import { typography } from "@/Kiosk/utils/typography";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ConfirmOrderModalProps {
    product: ProductItem | null; // null = modal is closed
    selectedColor?: string | null;
    onClose: () => void;
    onConfirmed?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ConfirmOrderModal({ product, selectedColor, onClose, onConfirmed }: ConfirmOrderModalProps) {
    const { addItem, cartItems } = useCart();

    const [quantity, setQuantity]   = useState(1);
    const [added, setAdded]         = useState(false);
    const [loading, setLoading]     = useState(false);
    const [visible, setVisible]     = useState(false);


    const displayImage = product?.color_variants?.find(
        (v) => v.color_name == selectedColor
    )?.image_path ?? product?.images?.[0]?.image_path ?? null;

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setAdded(false);
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [product]);

    if (!product) return null;

    // const maxQty   = product.quantity ?? 99;

    const selectedVariant = product.color_variants?.find(
        (v) => v.color_name == selectedColor
    );

    const totalStock = selectedVariant
        ? Number(selectedVariant.quantity)
        : (product.quantity ?? 99);

    // Subtract what's already in the cart for this exact product+color combo
    const alreadyInCart = cartItems.find(
        (i) => i.product_id === product.id && (i.color ?? null) === (selectedColor ?? null)
    )?.quantity ?? 0;

    const maxQty = Math.max(0, totalStock - alreadyInCart);

    const subtotal = Number(product.price) * quantity;

    const handleAddToCart = async () => {
            addItem({
                product_id: product.id,
                name:       product.name,
                sku:        product.sku,
                price:      Number(product.price),
                quantity,
                color:      selectedColor ?? null,
                image:      displayImage ?? null,
                stock: selectedVariant ? selectedVariant.quantity : product.quantity,
                subtotal,
            });
       
        setAdded(true);
        setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
                onClose();
                onConfirmed?.();
            }, 300);
        }, 800);
    };

    const handleBackdropClick = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "rgba(0,0,0,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.25s ease",
            }}
        >
            {/* Modal panel */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    width: 680,
                    zoom: 1.5,
                    maxWidth: "90vw",
                    overflow: "hidden",
                    transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
                    transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease",
                    opacity: visible ? 1 : 0,
                    boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
                }}
            >
                {/* Header */}
                <div style={{ background: colors.primary, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>ADD TO CART</span>
                    <button onClick={handleBackdropClick} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>

                {/* Body */}
                <div style={{ display: "flex", gap: 32, padding: 32 }}>
                    {/* Product image */}
                    {displayImage && (
                        <div style={{ width: 200, flexShrink: 0, borderRadius: 12, overflow: "hidden", background: "#f5f3f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img 
                                src={`/${displayImage}`}
                                alt={product.name}
                                style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                            />
                        </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <p style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>{product.name}</p>
                            <p style={{ fontSize: 26, fontWeight: 800, color: colors.primary, margin: 0 }}>{formatMoney(Number(product.price))}</p>
                        </div>

                        {product.item_description && (
                            <p style={{ fontSize: 15, color: "#5f5f5fff", fontWeight: 800, lineHeight: 1.6, margin: 0 }}>{product.item_description}</p>
                        )}

                        {/* Selected color / variant */}
                        {selectedColor && (
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "#888", margin: "0 0 8px" }}>SELECTED COLOR</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    {/* Color swatch */}
                                    <span
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            background: selectedColor,
                                            border: "2px solid #ddd",
                                            flexShrink: 0,
                                            display: "inline-block",
                                        }}
                                    />
                                    {/* Color name badge */}
                                    <span style={{
                                        padding: "6px 16px",
                                        borderRadius: 8,
                                        border: `2px solid ${colors.primary}`,
                                        color: colors.primary,
                                        fontSize: 13,
                                        fontWeight: 700,
                                        background: "#f5f0fb",
                                    }}>
                                        {selectedColor}
                                    </span>
                                </div> 
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                         
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    style={{ width: 40, height: 40, borderRadius: 8, border: `2px solid ${colors.primary}`, background: "#fff", color: colors.primary, fontSize: 22, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >−</button>
                                <span style={{ fontSize: 22, fontWeight: 700, minWidth: 32, textAlign: "center" }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                                    disabled={quantity >= maxQty}
                                    style={{ width: 40, height: 40, borderRadius: 8, border: `2px solid ${colors.primary}`, background: quantity >= maxQty ? "#eee" : "#fff", color: colors.primary, fontSize: 22, fontWeight: 700, cursor: quantity >= maxQty ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >+</button>
                                <span style={{ ...typography.quantity}}>{maxQty} in stock</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ borderTop: "1px solid #f0ede8", padding: "24px 32px",  background: "#faf9f7", flexShrink: 0}}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <p style={{ ...typography.amountFields, margin: "0 0 2px", letterSpacing: 1 }}>SUBTOTAL</p>
                        <p style={{ fontSize: 28, fontWeight: 800, color: colors.primary, margin: 0 }}>{formatMoney(subtotal)}</p>
                    </div>

                        <div style={{ display: "flex", gap: 16 }}>
                    <button
                        onClick={handleAddToCart}
                        disabled={added || loading || maxQty === 0}
                        style={{
                            flex: 1,
                            background: added ? "#22c55e" : maxQty === 0 ? "#aaa" : colors.primary,
                            color: "#fff", border: "none", borderRadius: 12,
                            padding: "16px 40px", fontSize: 15, fontWeight: 700,
                            letterSpacing: 1.5, cursor: added || loading || maxQty === 0 ? "not-allowed" : "pointer",
                            transition: "background 0.25s ease, transform 0.15s ease",
                            transform: added ? "scale(0.97)" : "scale(1)",
                            opacity: loading ? 0.85 : 1,
                            display: "flex", alignItems: "center", justifyContent:"center", gap: 10,
                            whiteSpace: "nowrap",   
                        }}
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                ADDING...
                            </>
                        ) : added ? "✓ ADDED TO CART" : maxQty === 0 ? "MAX STOCK REACHED" : "ADD TO CART"}
                    </button>
                        </div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        </div>
    );
}
