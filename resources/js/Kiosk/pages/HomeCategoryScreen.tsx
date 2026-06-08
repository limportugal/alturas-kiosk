import { useState, useEffect } from "react";
import { KIOSK_STYLE } from "@/Kiosk/components/shared";
import useDynamicQuery from "@/hooks/useDynamicQuery";
import { CategoriesPublicServices } from "@/Kiosk/services/category/GetCategoriesListServices";
import { CategoryList } from "@/Kiosk-Admin/types/category-types";
import { ImageCardButton } from "@/Kiosk/components/buttons/ImageCardButton";
import { typography } from "@/Kiosk/utils/typography";
import { colors } from "@/Kiosk/utils/colors";
import { useCartStore } from "@/Kiosk/store/useCartStore";

export default function HomeCategoryScreen({
  onSelect,
  onViewOrder,
}: {
  onSelect: (id: string, name: string) => void;
  onViewOrder: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

    const cartItems = useCartStore((s) => s.cartItems);
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const { data: categories_data } = useDynamicQuery(
    ["category-list"],
    CategoriesPublicServices
  );

  useEffect(() => {
    if (!categories_data?.data?.length) return;
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [categories_data]);

  const handlePress = (id: string, name: string) => {
    setPressed(id);
    setTimeout(() => { setPressed(null); onSelect(id, name); }, 220);
  };

  return (
    <div style={KIOSK_STYLE}>
      {/* Header */}
      <div style={{
        background: colors.surface,
        padding: "16px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #e0dbd5",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        flexShrink: 0,
      }}>
        <a href="/" style={{ display: "inline-block" }}>
          <img src="/images/H&F-Logo.png" alt="H&F Department Store" style={{ width: 420, height: "auto" }} />
        </a>
      </div>

      {/* Banner */}
      <div style={{ background: colors.primary, padding: "28px 0", textAlign: "center", flexShrink: 0 }}>
        <span style={{ ...typography.heading, color: colors.surface, letterSpacing: 5 }}>
          PLEASE CHOOSE A CATEGORY BELOW
        </span>
      </div>

      {/* Grid */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        padding: "40px 40px 40px",
        boxSizing: "border-box",
        overflow: "auto",
        alignItems: "start",
        alignContent: "start",
      
      }}>
        {categories_data?.data
          ?.filter((cat) => cat.status === "Active")
          .map((cat: CategoryList, i: number) => {
            const col = (i % 2) as 0 | 1;
            const row = Math.floor(i / 2);
            const isPressed = pressed === String(cat.id);
            const slideFrom = col === 0 ? "-120%" : "120%";
            const staggerDelay = row * 120 + col * 60;
            const cardTransform = !mounted
              ? `translateX(${slideFrom})`
              : isPressed ? "translateX(0) scale(0.97)" : "translateX(0) scale(1)";
            const cardTransition = !mounted
              ? "none"
              : `transform ${isPressed ? "0.12s" : "0.55s"} cubic-bezier(0.22,1,0.36,1) ${!isPressed ? staggerDelay : 0}ms, opacity 0.45s ease ${staggerDelay}ms`;

            return (
              <div
                key={cat.id}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: cardTransform,
                  transition: cardTransition,
                }}
              >
                <ImageCardButton
                  image={cat.image_path ? `/${cat.image_path}` : undefined}
                  label={cat.name}
                  active={isPressed}
                  onClick={() => handlePress(String(cat.id), cat.name)}
                  imageHeight={320}
                />
              </div>
            );
          })} 
      </div>
       {totalCount > 0 && (
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
        <button
          onClick={onViewOrder}
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
      </div>
      )}
    </div>
  );
}
