import { colors } from "@/Kiosk/utils/colors";

// ── 2. Image card button (sub-category grid, tab buttons) ───────────────────
export function ImageCardButton({
  image,
  label,
  active = false,
  onClick,
  width,
  imageHeight = 120,
}: {
  image?: string | null;
  label: string;
  active?: boolean;
  onClick: () => void;
  width?: number;
  imageHeight?: number;
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* centered text */}
        <span
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>

        {/* arrow fixed right */}
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
      </div>
    </button>
  );
}