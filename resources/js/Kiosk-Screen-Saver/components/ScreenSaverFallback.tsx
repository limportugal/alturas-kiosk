import { useEffect } from "react";
import { colors } from "@/Kiosk/utils/colors";

export interface ScreenSaverProduct {
    id: number | string;
    name: string;
    price: number;
    image_path?: string | null;
    category?: string;
}

interface ScreenSaverFallbackProps {
    visible: boolean;
    onDismiss: () => void;
    onProductSelect?: (product: ScreenSaverProduct) => void;
    products?: ScreenSaverProduct[];
}

const PLACEHOLDER_CARDS: ScreenSaverProduct[] = [
    { id: 1, name: "Sofas", price: 5000, category: "Living Room" },
    { id: 2, name: "Armchairs", price: 3500, category: "Living Room" },
    { id: 3, name: "Beds", price: 8000, category: "Bedroom" },
    { id: 4, name: "Cabinets", price: 4200, category: "Storage" },
    { id: 5, name: "Mirrors", price: 1800, category: "Decor" },
    { id: 6, name: "Lamps", price: 990, category: "Lighting" },
    { id: 7, name: "Bookcases", price: 3100, category: "Storage" },
    { id: 8, name: "Side Tables", price: 2200, category: "Living Room" },
    { id: 9, name: "Bath Sets", price: 1500, category: "Bathroom" },
    { id: 10, name: "Dining Sets", price: 12000, category: "Dining" },
];

const fmt = (n: number) => "PHP " + n.toLocaleString("en-PH");

export function ScreenSaverFallback({
    visible,
    onDismiss,
    onProductSelect,
    products,
}: ScreenSaverFallbackProps) {
    const cards = products && products.length > 0 ? products : PLACEHOLDER_CARDS;
    const duplicated = [...cards, ...cards];

    useEffect(() => {
        const id = "hf-screensaver-styles";
        if (document.getElementById(id)) return;

        const s = document.createElement("style");
        s.id = id;
        s.textContent = `
            @keyframes hf-slide-left {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            @keyframes hf-ss-pulse {
                0%, 100% { opacity: 0.4; }
                50%      { opacity: 1; }
            }
            @keyframes hf-ss-fadein {
                from { opacity: 0; }
                to   { opacity: 1; }
            }
            .hf-ss-card:hover {
                background: rgba(255,255,255,0.13) !important;
                border-color: rgba(255,255,255,0.28) !important;
                transform: scale(1.04);
            }
            .hf-ss-card:active {
                transform: scale(0.97);
            }
            .hf-ss-card {
                transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
            }
        `;
        document.head.appendChild(s);
        return () => s.remove();
    }, []);

    if (!visible) return null;

    const handleProductTap = (e: React.MouseEvent, product: ScreenSaverProduct) => {
        e.stopPropagation();
        onDismiss();
        onProductSelect?.(product);
    };

    return (
        <div
            onClick={onDismiss}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1400,
                background: "#1a0a2e",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                animation: "hf-ss-fadein 0.6s ease",
            }}
            aria-label="Screensaver - tap anywhere to browse"
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at 20% 50%, #2d1060 0%, #1a0a2e 65%)",
                    pointerEvents: "none",
                }}
            />

            <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginBottom: 32 }}>
                <p style={{ fontSize: 52, fontWeight: 700, color: "#fff", letterSpacing: 3, lineHeight: 1, margin: 0 }}>
                    H<span style={{ fontWeight: 300 }}>&</span>F
                </p>
                <p style={{ fontSize: 10, letterSpacing: 5, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
                    DEPARTMENT STORE
                </p>
            </div>

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
             
                    overflow: "hidden",
                    padding: "8px 0",
                    maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: 28,
                        padding: "0 56px",
                        width: "max-content",
                        
                        animation: `hf-slide-left ${Math.max(18, duplicated.length * 1.8)}s linear infinite`,
                    }}
                >
                    {duplicated.map((product, idx) => (
                        <ProductCard
                            key={`${product.id}-${idx}`}
                            product={product}
                            onClick={(e) => handleProductTap(e, product)}
                        />
                    ))}
                </div>
            </div>

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    marginTop: 34,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    animation: "hf-ss-pulse 2.5s ease-in-out infinite",
                }}
            >
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", letterSpacing: 3.5, margin: 0 }}>
                    TAP A PRODUCT TO BROWSE
                </p>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
            </div>
        </div>
    );
}

function ProductCard({
    product,
    onClick,
}: {
    product: ScreenSaverProduct;
    onClick: (e: React.MouseEvent) => void;
}) {
    return (
        <div
            className="hf-ss-card"
            onClick={onClick}
            style={{
                flexShrink: 0,
                width: 235,
                background: "rgba(255,255,255,0.07)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: 18,
                overflow: "hidden",
                cursor: "pointer",
            }}
        >
            <div
                style={{
                    height: 176,
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {product.image_path ? (
                    <img
                        src={`/${product.image_path}`}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                ) : (
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.1)",
                            border: "0.5px solid rgba(255,255,255,0.15)",
                        }}
                    />
                )}
            </div>

            <div style={{ padding: "16px 18px 18px" }}>
                <p
                    style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.9)",
                        margin: "0 0 7px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {product.name}
                </p>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", margin: "0 0 12px" }}>
                    {fmt(product.price)}
                </p>
                {product.category && (
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            background: `${colors.primary}99`,
                            color: "rgba(255,255,255,0.85)",
                            padding: "5px 9px",
                            borderRadius: 6,
                            letterSpacing: 0.9,
                            display: "inline-block",
                        }}
                    >
                        {product.category.toUpperCase()}
                    </span>
                )}
            </div>
        </div>
    );
}
