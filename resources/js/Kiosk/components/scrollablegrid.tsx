import { useRef, useState, useEffect, ReactNode, CSSProperties } from "react";
import { colors } from "@/Kiosk/utils/colors";

interface ScrollableGridProps {
  /** Items to render inside the grid */
  children: ReactNode;
  /** Number of columns (default: 3) */
  columns?: number;
  /** Gap between items in px (default: 28) */
  gap?: number;
  /** Padding inside the grid container (default: "36px 48px") */
  padding?: string;
  /** Max height before scrolling kicks in — set based on your kiosk screen */
  maxHeight?: number | string;
  /** Override container style */
  style?: CSSProperties;
}

export function ScrollableGrid({
  children,
  columns = 3, 
  gap = 28,
  padding = "36px 48px",
  maxHeight = "100%",
  style,
}: ScrollableGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showIndicator, setShowIndicator] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    setShowIndicator(!atBottom && el.scrollHeight > el.clientHeight);
  };

  useEffect(() => {
    // slight delay so grid has time to render before measuring
    const t = setTimeout(checkScroll, 120);
    return () => clearTimeout(t);
  }, [children]);

  const handleScrollDown = () => {
    containerRef.current?.scrollBy({ top: 340, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden", ...style }}>
      {/* Scrollable area */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        style={{
          height: "100%",
          maxHeight,
          minHeight: 0,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
          padding,
          paddingBottom: 50,
          alignItems: "start",
          alignContent: "start",
        }}
      >
        {children}
      </div>

      {/* Scroll indicator — only visible when there's overflow */}
      {showIndicator && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: "linear-gradient(to bottom, transparent, rgba(240,237,232,0.96))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: 14,
            pointerEvents: "none",
          }}
        >
          {/* "More items" label */}
          <span
            style={{
              background: colors.primary,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              padding: "4px 16px",
              borderRadius: 20,
              marginBottom: 10,
            }}
          >
            MORE ITEMS BELOW
          </span>

          {/* Bounce arrow button */}
          <button
            onClick={handleScrollDown}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: colors.primary,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "all",
              animation: "hf-bounce 1.4s ease-in-out infinite",
              boxShadow: "0 4px 16px rgba(107,47,160,0.35)",
            }}
            aria-label="Scroll down to see more items"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 7l6 6 6-6"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Bounce keyframes injected once */}
      <style>{`
        @keyframes hf-bounce {
          0%, 100% { transform: translateY(0); }
          45%       { transform: translateY(-8px); }
          65%       { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
