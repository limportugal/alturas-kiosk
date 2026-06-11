import { colors } from "@/Kiosk/utils/colors";
import { typography } from "@/Kiosk/utils/typography";

// ── 2. Image card button (sub-category grid, tab buttons) ───────────────────
export function ImageCardButton({
  image,
  label,
  active = false,
  onClick,
  width,
  imageHeight = 120,
  labelFontSize,
  showArrow,
}: {
  image?: string | null;
  label: string;
  active?: boolean;
  onClick: () => void;
  width?: number;
  imageHeight?: number;
  labelFontSize?: number;
  showArrow?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        border: active ? "3px solid #5a2d82" : "2px solid #e0dbd5",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        background: colors.surface,
        padding: 0,
        width: width ?? "100%",
        position: "relative",
        display: "block",
        boxShadow: active
          ? "0 4px 20px rgba(90,45,130,0.35)"
          : "0 4px 16px rgba(0,0,0,0.10)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Image */}
      <div style={{ width: "100%", height: imageHeight, overflow: "hidden", background: colors.background }}>
        <img
          src={image ?? undefined}
          alt={label}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Label bar overlaid at bottom */}
    <div
        style={{
          position: "relative",
          background: active ? "#3d1a5c" : "#5a2d82",
          padding: "14px 16px",
          height: 70,
          boxSizing:"border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* centered text */}
        <div
          style={{
            color: "#fff",
            ...typography.button,
            textTransform: "uppercase",
            fontSize: labelFontSize ?? typography.button.fontSize,

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",

            lineHeight: "1.2",
            maxWidth: showArrow ?? true ? "calc(100% - 50px)" : "100%",
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          {label}
        </div>

        {/* arrow fixed right */}
        {(showArrow ?? true) && (
        <span
          style={{
            position: "absolute",
            right: 16,
            color: "#fff",
            fontSize: 45,
            fontWeight: 700,
            opacity: 0.85,
          }}
        >
          ›
        </span>
          )}
      </div>
    </button>
  );
}