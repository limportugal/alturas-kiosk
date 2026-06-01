import { useState, useEffect } from "react";
import { CategoryData } from "../types/types";
import { HFHeader, PurpleBanner, MainMenuBtn, KIOSK_STYLE } from "../components/shared";
import { ImageCardButton } from "@/Kiosk/components/buttons/ImageCardButton";

import { typography } from "@/Kiosk/utils/typography";
import { colors } from "@/Kiosk/utils/colors";

export default function CategoryScreen({
  category,
  onBack,
  onSubSelect,
}: {
  category: CategoryData;
  onBack: () => void;
  onSubSelect: (subId: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [category.id]);

  const handlePress = (id: string) => {
    setPressed(id);
    setTimeout(() => { setPressed(null); onSubSelect(id); }, 220);
  };

  const slideDir = (col: number) => col === 0 ? "-130%" : col === 2 ? "130%" : "0%";
  const stagger  = (col: number, row: number) => row * 100 + col * 40;

  return (
    <div style={KIOSK_STYLE}>
      <HFHeader small />
      <PurpleBanner>{category.label}</PurpleBanner>
      <MainMenuBtn onClick={onBack} />

      {/* Hero card */}
      <div style={{ margin: "32px 48px 0", display: "flex", gap: 32, background: colors.primary, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
        <div style={{ width: 320, flexShrink: 0, position: "relative" }}>
          <img src={category.image} alt={category.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(90,45,130,0.85)", padding: "14px 18px" }}>
            <span style={{ color: colors.surface, ...typography.title, letterSpacing: 2 }}>{category.label}</span>
          </div>
        </div>
        <div style={{ flex: 1, padding: "32px 32px 32px 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ color: colors.surface, ...typography.hero, margin: "0 0 16px", fontFamily: "Georgia, serif" }}>
            Welcome to the {category.label.toLowerCase()} category!
          </p>
          <p style={{ color: "rgba(255,255,255,0.88)", ...typography.serifBody, lineHeight: 1.6, margin: 0 }}>
            {category.description}
          </p>
        </div>
      </div>

      {/* Sub-category grid */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28, padding: "36px 48px", boxSizing: "border-box", overflow: "auto", alignItems: "start", alignContent: "start" }}>
        {category.subCategories.map((sub) => {
          const isPressed = pressed === sub.id;
          const delay = stagger(sub.column, sub.row);
          const tx = !mounted ? slideDir(sub.column) : isPressed ? "translateX(0) scale(0.95)" : "translateX(0) scale(1)";
          const tr = !mounted ? "none" : `transform ${isPressed ? "0.12s" : "0.5s"} cubic-bezier(0.22,1,0.36,1) ${!isPressed ? delay : 0}ms, opacity 0.4s ease ${delay}ms`;

          return (
            <div
              key={sub.id}
              style={{
                opacity: mounted ? 1 : 0,
                transform: tx,
                transition: tr,
              }}
            >
              <ImageCardButton
                image={sub.image}
                label={sub.label}
                active={isPressed}
                onClick={() => handlePress(sub.id)}
                imageHeight={200}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
