import { CSSProperties, ReactNode } from "react";

interface SoldOutOverlayProps {
    children: ReactNode;
    soldOut: boolean;
    badgePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    style?: CSSProperties;
    onClick?: () => void;
}

const BADGE_POS: Record<NonNullable<SoldOutOverlayProps["badgePosition"]>, CSSProperties> = {
    "top-left": { top: 10, left: 10 },
    "top-right": { top: 10, right: 10 },
    "bottom-left": { bottom: 10, left: 10 },
    "bottom-right": { bottom: 10, right: 10 },
};

interface SoldOutCheckParams {
    productQty: number | null | undefined;
    variantQty?: number | null | undefined | Array<number | null | undefined>;
}

export const isSoldOut = ({ productQty, variantQty }: SoldOutCheckParams): boolean => {
    const productEmpty = (productQty ?? 0) <= 0;

    if (variantQty === undefined || variantQty === null) {
        return productEmpty;
    }

    if (Array.isArray(variantQty)) {
        const allVariantsEmpty = variantQty.every((q) => (q ?? 0) <= 0);
        return productEmpty && allVariantsEmpty;
    }

    return variantQty <= 0;
};

export function SoldOutOverlay({
    children,
    soldOut,
    badgePosition = "top-left",
    style,
    onClick,
}: SoldOutOverlayProps) {
    if (!soldOut) return <>{children}</>;

    return (
        <div style={{ position: "relative", display: "inline-block", width: "100%", ...style }}>
            <div style={{ filter: "grayscale(100%)", opacity: 0.5, pointerEvents: "none", userSelect: "none" }}>
                {children}
            </div>

            <div
                onClick={onClick}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.18)",
                    borderRadius: "inherit",
                    cursor: onClick ? "pointer" : "default",
                }}
            />

            <div
                style={{
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
                }}
            >
                SOLD OUT
            </div>
        </div>
    );
}

interface SoldOutCardProps {
    children: ReactNode;
    soldOut: boolean;
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
            <div
                style={{
                    filter: soldOut ? "grayscale(100%)" : "none",
                    opacity: soldOut ? 0.5 : 1,
                    pointerEvents: soldOut ? "none" : "auto",
                    transition: "filter 0.2s ease, opacity 0.2s ease",
                }}
            >
                {children}
            </div>

            {soldOut && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.22)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                    }}
                >
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>

                    <span
                        style={{
                            background: "#1a1a1a",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 2,
                            padding: "5px 14px",
                            borderRadius: 4,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        }}
                    >
                        SOLD OUT
                    </span>
                </div>
            )}
        </div>
    );
}
