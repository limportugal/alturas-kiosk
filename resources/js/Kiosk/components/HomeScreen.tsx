import { useState, useEffect } from "react";
import { KIOSK_STYLE } from "@/Kiosk/components/shared";
import { HOME_CATEGORIES } from "@/Kiosk/data";

import { typography } from "@/Kiosk/utils/typography";


export default function HomeScreen({ onSelect }: { onSelect: (id: string) => void }) {
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handlePress = (id: string) => {
    setPressed(id);
    setTimeout(() => { setPressed(null); onSelect(id); }, 220);
  };

  return (
    <div style={KIOSK_STYLE}>
      {/* Header */}
      <div style={{ 
        background: "#fff", 
        padding: "16px 0", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        borderBottom: "1px solid #e0dbd5", 
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)", 
        flexShrink: 0 
        }}
        >
        <a href="/" style={{ display: "inline-block" }}>
          <img src="/images/H&F-Logo.png" alt="H&F Department Store" style={{ width: 420, height: "auto" }} />
        </a>
      </div>

      {/* Banner */}
      <div style={{ background: "#5a2d82", padding: "28px 0", textAlign: "center", flexShrink: 0 }}>
        <span style={{ ...typography.heading, color: "#fff", letterSpacing: 5 }}>
          PLEASE CHOOSE A CATEGORY BELOW
        </span>
      </div>

      {/* Grid */}
      <div style={{ 
        flex: 1, display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gridTemplateRows: "1fr 1fr 1fr", 
        gap: 32, 
        padding: "56px 60px", 
        boxSizing: "border-box" 
        }}
        >
        {HOME_CATEGORIES.map((cat) => {
          const isPressed = pressed === cat.id;
          const slideFrom = cat.column === 0 ? "-120%" : "120%";
          const staggerDelay = cat.row * 120 + cat.column * 60;
          const cardTransform = !mounted ? `translateX(${slideFrom})` : isPressed ? "translateX(0) scale(0.97)" : "translateX(0) scale(1)";
          const cardTransition = !mounted ? "none"
            : `transform ${isPressed ? "0.12s" : "0.55s"} cubic-bezier(0.22,1,0.36,1) ${!isPressed ? staggerDelay : 0}ms, border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.45s ease ${staggerDelay}ms`;

          return (
            <button
              key={cat.id}
              onClick={() => handlePress(cat.id)}
              style={{
                border: "3px solid rgba(90,45,130,0.2)",
                borderRadius: 20,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                background: "none",
                padding: 0,
                opacity: mounted ? 1 : 0,
                transform: cardTransform,
                transition: cardTransition,
                boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
              }}
            >
              <div style={{ width: "100%", aspectRatio: "460 / 280", overflow: "hidden", background: "#ddd" }}>
                <img src={cat.image} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ background: "#5a2d82", padding: "22px 24px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...typography.title, color: "#fff"}}>{cat.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {/* <div style={{ background: "#fff", borderTop: "1px solid #e0dbd5", padding: "28px 60px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Alturas Mall", "Farm City", "Alturas City"].map((name) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, color: "#5a2d82", fontSize: 20, fontFamily: "Arial, sans-serif", letterSpacing: 1 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5a2d82" }} />
              {name}
            </div>
          ))}
        </div>
        <div style={{ color: "#9a8a8a", fontSize: 18, fontFamily: "Arial, sans-serif", letterSpacing: 1 }}>Touch to explore</div>
      </div> */}

      <style>{`@keyframes popIn { from{opacity:0;transform:scale(0.4)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}