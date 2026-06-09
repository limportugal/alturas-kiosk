import { CSSProperties, ReactNode } from "react";
import { boolean } from "zod";

interface SoldOutOverlayProps {
    /** Content to render inside (usually your product image) */
    children: ReactNode;
    /** Is this item sold out? When false, renders children as-is */
    soldOut: boolean;
    /** Override badge position. Default: top-left */
    badgePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    /** Override container style */
    style?: CSSProperties;
}
 

// ─── Badge position map ───────────────────────────────────────────────────────
const BADGE_POS: Record<NonNullable<SoldOutOverlayProps["badgePosition"]>, CSSProperties> = {
    "top-left":     { top: 10, left: 10 },
    "top-right":    { top: 10, right: 10 },
    "bottom-left":  { bottom: 10, left: 10 },
    "bottom-right": { bottom: 10, right: 10 },
};

// ─────────────────────────────────────────────────────────────────────────────
// isSoldOut — central sold-out check
//
// Rule: sold out ONLY when BOTH product quantity AND variant quantity are 0.
//       If either one still has stock, item is still available.
//
// Usage examples:
//
//   // Product grid (no variant selected yet — check product only)
//   isSoldOut({ productQty: product.quantity })
//
//   // Product detail with selected color variant
//   isSoldOut({ productQty: product.quantity, variantQty: selectedVariant?.quantity })
//
//   // Subcategory card (no variant context)
//   isSoldOut({ productQty: sub.quantity })
// ─────────────────────────────────────────────────────────────────────────────


interface SoldOutCheckParams {
    productQty: number | null | undefined;
    variantQty?: number | null | undefined | Array<number | null | undefined>;
}


// ─────────────────────────────────────────────────────────────────────────────
// isSoldOut — utility helper
// Centralizes the sold-out check so you don't repeat the condition everywhere.
// Usage:  isSoldOut(item.stock)  →  true / false
// ─────────────────────────────────────────────────────────────────────────────
 
export const isSoldOut = ({ productQty, variantQty}:SoldOutCheckParams): boolean => {
    const productEmpty = (productQty ?? 0) <= 0;

    // No variant info passed -rely on product quantity alone
    if(variantQty === undefined || variantQty === null){
        return productEmpty;
    }

    // Array of ALL variants (product card on grid) —
    // variant quantity IS the source of truth when variants exist
    if (Array.isArray(variantQty)) {
        const allVariantsEmpty = variantQty.every((q) => (q ?? 0) <= 0);
        return productEmpty && allVariantsEmpty;
    }
    // Single variant quantity — variant's own quantity is the source of truth
    // productQty is intentionally ignored here — each variant tracks its own stock
    return variantQty <= 0;

};
 

// ─────────────────────────────────────────────────────────────────────────────
// SoldOutOverlay
// Wraps ANY content (image, card body, etc.) with a gray overlay + badge.
// Usage:
//   <SoldOutOverlay soldOut={item.stock === 0}>
//     <img src={item.image} />
//   </SoldOutOverlay>
// ─────────────────────────────────────────────────────────────────────────────

export function SoldOutOverlay({
    children,
    soldOut,
    badgePosition = "top-left",
    style,
}: SoldOutOverlayProps) {
    if (!soldOut) return <>{children}</>;
 
    return (
        <div style={{ position: "relative", display: "inline-block", width: "100%", ...style }}>
            {/* Grayscale + dim the content */}
            <div style={{ filter: "grayscale(100%)", opacity: 0.5, pointerEvents: "none", userSelect: "none" }}>
                {children}
            </div>
 
            {/* Dark overlay */}
            <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.18)",
                borderRadius: "inherit",
            }} />
 
            {/* SOLD OUT badge */}
            <div style={{
                position: "absolute",
                ...BADGE_POS[badgePosition],
                background: "#1a1a1a",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                padding: "4px 10px",
                borderRadius: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                userSelect: "none",
                whiteSpace: "nowrap",
            }}>
                SOLD OUT
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SoldOutCard
// Full card wrapper — grays out the entire card and disables pointer events.
// Usage:
//   <SoldOutCard soldOut={item.stock === 0} onClick={...}>
//     <ImageCardButton ... />
//   </SoldOutCard>
// ─────────────────────────────────────────────────────────────────────────────

interface SoldOutCardProps {
    children: ReactNode;
    soldOut: boolean;
    /** Called only when NOT sold out */
    onClick?: () => void;
    style?: CSSProperties;
}
 
export function SoldOutCard({ children, soldOut, onClick, style }: SoldOutCardProps) {
    return (
        <div
            onClick={soldOut ? undefined : onClick}
            style={{
                position: "relative",
                cursor: soldOut ? "not-allowed" : "pointer",
                borderRadius: 12,
                overflow: "hidden",
                ...style,
            }}
        >
            {/* Gray + dim entire card when sold out */}
            <div style={{
                filter: soldOut ? "grayscale(100%)" : "none",
                opacity: soldOut ? 0.5 : 1,
                pointerEvents: soldOut ? "none" : "auto",
                transition: "filter 0.2s ease, opacity 0.2s ease",
            }}>
                {children}
            </div>
 
            {/* Full-card overlay + centered SOLD OUT label */}
            {soldOut && (
                <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.22)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                }}>
                    {/* Icon */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                    </svg>
 
                    {/* Label */}
                    <span style={{
                        background: "#1a1a1a",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 2,
                        padding: "5px 14px",
                        borderRadius: 4,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    }}>
                        SOLD OUT
                    </span>
                </div>
            )}
        </div>
    );
}


