import { colors } from "@/Kiosk/utils/colors";


// ── 3. Thumbnail button (product images, color variants) ────────────────────
export function ThumbnailButton({
  image,
  alt = "",
  active = false,
  onClick,
  width = 120,
  height = 120,
}: {
  image: string;
  alt?: string;
  active?: boolean;
  onClick?: () => void;
  width?: number;
  height?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width,
        height,
        border: active ? "4px solid #5a2d82" : "2px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
        background: colors.background,
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <img
        src={image}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: 6, boxSizing: "border-box" }}
      />
    </button>
  );
}
