import { useState } from "react";
import { useCartStore } from "@/Kiosk/store/useCartStore";
import { CartSummaryModal } from "@/Kiosk/modals/CartSummaryModal";

function CartBagSvg({ color, size = 28 }: { color: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
        </svg>
    );
}

interface CartIconProps {
    style?: React.CSSProperties;
    onClick?: () => void;
    /** Hide the button entirely when the cart has no items (home, sub-category screens). */
    hideWhenEmpty?: boolean;
    /** Show a grey disabled look when the cart is empty (product screens). */
    grayWhenEmpty?: boolean;
}

export function CartIcon({ style, onClick, hideWhenEmpty = false, grayWhenEmpty = false }: CartIconProps) {
    const cartItems  = useCartStore((s) => s.cartItems);
    const totalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    const [open, setOpen] = useState(false);

    if (hideWhenEmpty && totalCount === 0) {
        return null;
    }

    const isEmpty = totalCount === 0;
    const isGrayEmpty = isEmpty && grayWhenEmpty;
    const background = isGrayEmpty ? "#e8e8e8" : "#5a2d82";
    const foreground = isGrayEmpty ? "#888888" : "#ffffff";

    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        setOpen(true);
    };

    const button = (
        <button
            onClick={handleClick}
            aria-label={`View cart (${totalCount} items)`}
            style={{
                position: "relative",
                background,
                border: isGrayEmpty ? "2px solid #cccccc" : "none",
                borderRadius: 12,
                padding: "20px 32px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: foreground,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 2,
                fontFamily: "Arial, sans-serif",
                flex: 1,
                justifyContent: "center",
                ...style,
            }}
        >
            <CartBagSvg color={foreground} />
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
    );

    return (
        <>
            {hideWhenEmpty ? (
                <div
                    style={{
                        background: "#fff",
                        borderTop: "1px solid #e0dbd5",
                        padding: "24px 48px",
                        flexShrink: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {button}
                </div>
            ) : (
                button
            )}

            {!onClick && <CartSummaryModal open={open} onClose={() => setOpen(false)} />}
        </>
    );
}
