import { useState } from "react";
import { Product } from "@/Kiosk/types/types";

export default function OrderModal({
  product,
  color,
  onConfirm,
  onCancel,
}: {
  product: Product;
  color: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [qty, setQty] = useState(1);
  const total = product.price * qty;

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(180,160,210,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#fff", borderRadius: 20, border: "3px solid #5a2d82", width: 820, overflow: "hidden", animation: "slideUp 0.3s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 24px 80px rgba(90,45,130,0.3)" }}>
        <div style={{ background: "#5a2d82", padding: "28px 0", textAlign: "center" }}>
          <span style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: 4, fontFamily: "Arial, sans-serif" }}>ORDER DETAILS</span>
        </div>
        <div style={{ background: "#f0ede8", padding: "28px", display: "flex", justifyContent: "center" }}>
          <img src={product.images[0]} alt={product.name} style={{ height: 260, objectFit: "contain", display: "block" }} />
        </div>
        <div style={{ padding: "24px 40px" }}>
          {([
            ["ITEM:", `${product.name}  ${product.subtitle.split(",")[0]}`],
            ["PRICE:", `₱${product.price.toLocaleString()}.00`],
            ["SKU:", product.sku],
            ["COLOR VARIANTS:", color],
            ["STOCK:", `${product.stock}`],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} style={{ padding: "14px 0", borderBottom: "1px solid #eee", display: "flex", gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#111", fontFamily: "Arial, sans-serif", minWidth: 260 }}>{label}</span>
              <span style={{ fontSize: 26, color: "#111", fontFamily: "Arial, sans-serif" }}>{value}</span>
            </div>
          ))}

          {/* Quantity */}
          <div style={{ padding: "20px 0", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#111", fontFamily: "Arial, sans-serif" }}>QUANTITY:</span>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 52, height: 52, borderRadius: "50%", background: "#222", border: "none", color: "#fff", fontSize: 28, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ fontSize: 32, fontWeight: 700, minWidth: 48, textAlign: "center", fontFamily: "Arial, sans-serif" }}>{qty}</span>
            <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ width: 52, height: 52, borderRadius: "50%", background: "#222", border: "none", color: "#fff", fontSize: 28, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>

          {/* Total */}
          <div style={{ padding: "20px 0", display: "flex", gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#111", fontFamily: "Arial, sans-serif" }}>TOTAL AMOUNT DUE:</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#111", fontFamily: "Arial, sans-serif" }}>₱{total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: "flex", borderTop: "2px solid #e0dbd5" }}>
          <button onClick={onConfirm} style={{ flex: 1, background: "#5a2d82", border: "none", padding: "28px 0", fontSize: 26, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 3, fontFamily: "Arial, sans-serif", borderRight: "1px solid rgba(255,255,255,0.2)" }}>CONFIRM ORDER</button>
          <button onClick={onCancel}  style={{ flex: 1, background: "#5a2d82", border: "none", padding: "28px 0", fontSize: 26, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: 3, fontFamily: "Arial, sans-serif" }}>CANCEL</button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from{opacity:0;transform:translateY(60px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>
    </div>
  );
}
