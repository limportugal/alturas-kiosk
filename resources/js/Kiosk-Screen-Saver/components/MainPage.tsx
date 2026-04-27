import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// 🖼️  SWAP THESE IMAGE PATHS WITH YOUR OWN
// ─────────────────────────────────────────────
const CATEGORY_IMAGES = {
  "living-room": "/images/Living-room.avif",
  "dining-room":  "/images/dining-room.avif",
  "kitchen":      "/images/kitchen.avif",
  "bedroom":      "/images/bed-room.avif",
  "appliances":   "/images/appliances.jpg",
  "bathroom":     "/images/bathroom.avif",

} as const;
// ─────────────────────────────────────────────

type CategoryId = keyof typeof CATEGORY_IMAGES;

interface Category {
  id: CategoryId;
  label: string;
  // 0 = left column, 1 = right column
  column: 0 | 1;
  // row index 0,1,2 — controls stagger delay
  row: number;
}

const categories: Category[] = [
  { id: "living-room", label: "LIVING ROOM", column: 0, row: 0 },
  { id: "dining-room", label: "DINING ROOM", column: 1, row: 0 },
  { id: "kitchen",     label: "KITCHEN",     column: 0, row: 1 },
  { id: "bedroom",     label: "BED ROOM",    column: 1, row: 1 },
  { id: "appliances",  label: "APPLIANCES",  column: 0, row: 2 },
  { id: "bathroom",    label: "BATH ROOM",   column: 1, row: 2 },
];

export default function HFKioskCategorySelect() {
  const [pressed, setPressed]   = useState<CategoryId | null>(null);
  const [selected, setSelected] = useState<CategoryId | null>(null);
  const [mounted, setMounted]   = useState(false);

  // Trigger entrance animation shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handlePress = (id: CategoryId) => {
    setPressed(id);
    setSelected(id);
    setTimeout(() => setPressed(null), 200);
  };

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: "#f5f2ee",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: "relative",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: "#fff",
          padding: "16px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #e0dbd5",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}
      >
        <img
          src="/images/H&F-Logo.png"
          alt="H&F Department Store"
          style={{ width: 420, height: "auto" }}
        />
      </div>

      {/* ── BANNER ── */}
      <div style={{ background: "#5a2d82", padding: "32px 0", textAlign: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 5, fontFamily: "Arial, sans-serif" }}>
          PLEASE CHOOSE A CATEGORY BELOW
        </span>
      </div>

      {/* ── GRID ── */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          gap: 32,
          padding: "56px 60px",
          boxSizing: "border-box",
        }}
      >
        {categories.map((cat) => {
          const isPressed  = pressed  === cat.id;
          const isSelected = selected === cat.id;

          // Left column slides in from the left, right column from the right
          const slideFrom  = cat.column === 0 ? "-120%" : "120%";

          // Stagger: each row adds 120ms delay, right column adds extra 60ms
          const staggerDelay = cat.row * 120 + cat.column * 60;

          const cardTransform = !mounted
            ? `translateX(${slideFrom})`
            : isPressed
            ? "translateX(0) scale(0.97)"
            : "translateX(0) scale(1)";

          const cardTransition = !mounted
            ? "none"
            : `transform ${isPressed ? "0.12s" : "0.55s"} cubic-bezier(0.22, 1, 0.36, 1) ${mounted && !isPressed ? `${staggerDelay}ms` : "0ms"},
               border-color 0.2s ease,
               box-shadow 0.2s ease,
               opacity 0.45s ease ${staggerDelay}ms`;

          return (
            <button
              key={cat.id}
              onClick={() => handlePress(cat.id)}
              style={{
                border: isSelected ? "5px solid #5a2d82" : "3px solid rgba(90,45,130,0.2)",
                borderRadius: 20,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                background: "none",
                padding: 0,
                opacity: mounted ? 1 : 0,
                transform: cardTransform,
                transition: cardTransition,
                boxShadow: isSelected
                  ? "0 12px 48px rgba(90,45,130,0.35)"
                  : "0 6px 24px rgba(0,0,0,0.12)",
              }}
            >
              {/* ── IMAGE AREA — swap src to change the photo ── */}
              <div style={{ width: "100%", aspectRatio: "460 / 280", overflow: "hidden", background: "#ddd" }}>
                <img
                  src={CATEGORY_IMAGES[cat.id]}
                  alt={cat.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* ── LABEL BAR ── */}
              <div
                style={{
                  background: "#5a2d82",
                  padding: "22px 24px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: 4, fontFamily: "Arial, sans-serif" }}>
                  {cat.label}
                </span>
              </div>

              {/* ── SELECTED CHECKMARK ── */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#5a2d82",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    color: "#fff",
                    fontWeight: 700,
                    animation: "popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── FOOTER ── */}
      {/* <div
        style={{
          background: "#fff",
          borderTop: "1px solid #e0dbd5",
          padding: "28px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Alturas Mall", "Farm City", "Alturas City"].map((name) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, color: "#5a2d82", fontSize: 20, fontFamily: "Arial, sans-serif", letterSpacing: 1 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5a2d82", flexShrink: 0 }} />
              {name}
            </div>
          ))}
        </div>
        <div style={{ color: "#9a8a8a", fontSize: 18, fontFamily: "Arial, sans-serif", letterSpacing: 1 }}>
          Touch to explore
        </div>
      </div> */}

      {/* ── SELECTION TOAST ── */}
      {/* {selected && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#5a2d82",
            color: "#fff",
            padding: "20px 60px",
            borderRadius: 50,
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            letterSpacing: 2,
            boxShadow: "0 8px 32px rgba(90,45,130,0.4)",
            whiteSpace: "nowrap",
            animation: "fadeUp 0.3s ease",
          }}
        >
          {categories.find((c) => c.id === selected)?.label} selected →
        </div>
      )} */}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}