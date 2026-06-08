import { typography } from "@/Kiosk/utils/typography";
import { CSSProperties, ReactNode } from "react";
import { colors } from "@/Kiosk/utils/colors";

// ── 1. Primary CTA button (BACK, ORDER ITEM, MAIN MENU, etc.) ──────────────
export function KioskButton({
  onClick,
  children,
  style,
}: {
  onClick: () => void;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: colors.primary,
        border: "none",
        borderRadius: 8,
        padding: "26px 60px",
        color: colors.surface,
        cursor: "pointer",
        ...typography.button,
        ...style,
      }}
    >
      {children} 
    </button>
  );
}