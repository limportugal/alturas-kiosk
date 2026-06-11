import { typography } from "@/Kiosk/utils/typography";
import { CSSProperties, ReactNode } from "react";
import { colors } from "@/Kiosk/utils/colors";

// ── 1. Primary CTA button (BACK, ORDER ITEM, MAIN MENU, etc.) ──────────────
export function KioskButton({
  onClick,
  children,
  style,
  disabled = false,
}: {
  onClick: () => void;
  children: ReactNode;
  style?: CSSProperties;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#b0a0c0" : colors.primary,
        border: "none",
        borderRadius: 8,
        padding: "26px 60px",
        color: colors.surface,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        ...typography.button,
        ...style,
      }}
    >
      {children} 
    </button>
  );
}