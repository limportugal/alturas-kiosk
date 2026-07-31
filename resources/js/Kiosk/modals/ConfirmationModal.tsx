import { useEffect, useState } from "react";

export default function ConfirmationModal({ onClose }: { onClose: () => void }) {
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(180,160,210,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#fff", borderRadius: 20, border: "3px solid #5a2d82", width: 820, overflow: "hidden", animation: "slideUp 0.3s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 24px 80px rgba(90,45,130,0.3)" }}>
        <div style={{ background: "#5a2d82", padding: "28px 0", textAlign: "center", position: "relative" }}>
          <span style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: 4, fontFamily: "Arial, sans-serif" }}>ORDER DETAILS</span>
          {/* Visual Progress Bar */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "4px",
            background: "#ffd700", // Gold progress bar for premium indicator
            animation: "shrink 8s linear forwards",
            transformOrigin: "left",
            width: "100%"
          }} />
        </div>
        <div style={{ padding: "60px 60px 40px", textAlign: "center" }}>
          <p style={{ fontSize: 38, fontWeight: 700, color: "#5a2d82", lineHeight: 1.5, margin: "0 0 48px", fontFamily: "Arial, sans-serif", letterSpacing: 1 }}>
            PLEASE CLAIM YOUR ORDER RECEIPT AND PRESENT IT TO THE CASHIER.
          </p>
          <p style={{ fontSize: 38, fontWeight: 700, color: "#5a2d82", lineHeight: 1.5, margin: 0, fontFamily: "Arial, sans-serif", letterSpacing: 1 }}>
            THANK YOU FOR USING OUR KIOSK ORDERING SYSTEM.
          </p>
        </div>
        <div style={{ padding: "0 60px 48px", display: "flex", justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{ background: "#5a2d82", border: "none", borderRadius: 8, padding: "24px 120px", fontSize: 28, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 4, fontFamily: "Arial, sans-serif" }}
          >
            CLOSE ({countdown})
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(60px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
}

