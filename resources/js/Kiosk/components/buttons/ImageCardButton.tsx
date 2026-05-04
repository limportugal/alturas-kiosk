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
  image: string;
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
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        background: colors.surface,
        padding: 0,
        width: width ?? "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: active ? "0 4px 16px rgba(90,45,130,0.3)" : "0 4px 16px rgba(0,0,0,0.10)",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ overflow: "hidden", background: colors.background, height: imageHeight }}>
        <img
          src={image}
          alt={label}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div
        style={{
          background: active ? colors.primary : colors.background,
          padding: "10px 8px",
          fontSize: 18,
          fontWeight: 600,
          color: active ? colors.surface : colors.primary,
          fontFamily: "Noto IKEA,Noto Sans,Roboto,Open Sans, system-ui, sans-serif ",
          textAlign: "center",
          borderTop: "1px solid #e0d8f0",
        }}
      >
        {label}
      </div>
    </button>
  );
}