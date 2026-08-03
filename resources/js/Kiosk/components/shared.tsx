import React from "react";

export function Stars({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <span style={{ color: "#f5a623", fontSize: size, lineHeight: 1 }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

import useDynamicQuery from "@/hooks/useDynamicQuery";
import { PublicActiveLogoService } from "@/Kiosk-Admin/services/logo/PublicActiveLogoService";

export function HFHeader({ small }: { small?: boolean }) {
  const { data } = useDynamicQuery(["kiosk-active-logo"], PublicActiveLogoService);
  const logoUrl = data?.logo_url ?? "/images/LegacyFurniture-removebg-preview(1).png";

  return (
    <div
      style={{
        background: "#fff",
        padding: small ? "12px 0" : "16px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #e0dbd5",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        flexShrink: 0,
      }}
    >
      <img
        src={logoUrl}
        alt="Kiosk Brand Logo"
        style={{ maxHeight: small ? 160 : 185, maxWidth: 600, width: "auto", height: "auto", objectFit: "contain" }}
      />
    </div>
  );
}

export function PurpleBanner({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <div style={{ background: "#5a2d82", padding: small ? "18px 0" : "28px 0", textAlign: "center", flexShrink: 0 }}>
      <span style={{ fontSize: small ? 26 : 36, fontWeight: 700, color: "#fff", letterSpacing: 4, fontFamily: "Arial, sans-serif" }}>
        {children}
      </span>
    </div>
  );
}
 
export function MainMenuBtn({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "15px 48px 10px", marginTop:"-8px", flexShrink: 0 }}>
      <button
        onClick={onClick}
        style={{
          background: "#5a2d82",
          border: "3px solid #5a2d82",
          borderRadius: 8,
          padding: "14px 44px",
          fontSize: 24,
          fontWeight: 700,
          color: "#ffffffff",
          letterSpacing: 4,
          cursor: "pointer",
          fontFamily: "Arial, sans-serif",
        }}
      >
        MAIN MENU
      </button>
    </div>
  );
}


export const KIOSK_STYLE: React.CSSProperties = {
  width: 1080,
  height: 1920,
  background: "#f5f2ee",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
};


export const formatMoney = (amount:number | string) => 
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(Number(amount))
 