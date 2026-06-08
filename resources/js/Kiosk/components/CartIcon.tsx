import { useState } from "react";
import { useCartStore } from "@/Kiosk/store/useCartStore";
import { CartSummaryModal } from "@/Kiosk/modals/CartSummaryModal";

interface CartIconProps {
    style?: React.CSSProperties;
    onClick?: () => void;
}

export function CartIcon({ style, onClick }: CartIconProps) {
    const cartItems  = useCartStore((s) => s.cartItems);
    const totalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        setOpen(true);
    };

    return (
        <>
            <button
                onClick={handleClick}
                aria-label={`View cart (${totalCount} items)`}
                style={{
                    position: "relative",
                    background: totalCount > 0 ? "#5a2d82" : "#ccc",
                    border: "none",
                    borderRadius: 12,
                    padding: "20px 32px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: 2,
                    fontFamily: "Arial, sans-serif",
                    transition: "background 0.2s ease",
                    flex: 1,
                    justifyContent: "center",
                    ...style,
                }}
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                VIEW ORDER
                {totalCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            background: "#ef4444",
                            color: "#fff",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            fontSize: 13,
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid #fff",
                        }}
                    >
                        {totalCount > 99 ? "99+" : totalCount}
                    </span>
                )}
            </button>

            {!onClick && <CartSummaryModal open={open} onClose={() => setOpen(false)} />}
        </>
    );
}
