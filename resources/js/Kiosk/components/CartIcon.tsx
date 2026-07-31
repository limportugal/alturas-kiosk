import { useState } from "react";
import { useCartStore } from "@/Kiosk/store/useCartStore";
import { CartSummaryModal } from "@/Kiosk/modals/CartSummaryModal";

import { Badge } from "@/Kiosk/components/UI/Badge";

function CartIconSvg({ color, size = 28 }: { color: string; size?: number }) {
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
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
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
    const isDisabled = isEmpty && grayWhenEmpty;
    const background = isGrayEmpty ? "rgba(255, 255, 255, 0.15)" : "#ffffff";
    const foreground = isGrayEmpty ? "rgba(255, 255, 255, 0.45)" : "#5a2d82";

    const handleClick = () => {
        if(isEmpty && grayWhenEmpty) {
            return;
        }
        if (onClick) {
            onClick();
            return;
        }
        setOpen(true);
    };

    const button = (
        <button
            disabled={isDisabled}
            onClick={handleClick}
            aria-label={`View cart (${totalCount} items)`}
            style={{
                position: "relative",
                background,
                border: isGrayEmpty ? "2px dashed rgba(255, 255, 255, 0.3)" : "none",
                borderRadius: "50%",
                width: 76,
                height: 76,
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: foreground,
                boxShadow: isGrayEmpty ? "none" : "0 4px 12px rgba(90, 45, 130, 0.25)",
                transition: "all 0.2s ease",
                padding: 0,
                flexShrink: 0,
                ...style,
            }}
        >
            <CartIconSvg color={foreground} size={36} />
             <Badge value={totalCount} show={totalCount > 0} style={{ top: -6, right: -6, fontSize: 18 }} />
        </button>
    );

    return (
        <>
            {button}

            {!onClick && <CartSummaryModal open={open} onClose={() => setOpen(false)} />}
        </>
    );
}
