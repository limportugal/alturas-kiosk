import { useState } from "react";
import { CategoryData, Product } from "@/Kiosk/types/types";
import { HFHeader, PurpleBanner, MainMenuBtn, KIOSK_STYLE } from "@/Kiosk/components/shared";

import { typography } from "@/Kiosk/utils/typography";

export default function ProductScreen({
  product,
  category,
  subId,
  onBack,
  onHome,
  onOrder,
}: {
  product: Product;
  category: CategoryData;
  subId: string;
  onBack: () => void;
  onHome: () => void;
  onOrder: (product: Product, color: string, qty: number) => void;
}) {
  const [activeImg, setActiveImg]     = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const sub = category.subCategories.find((s) => s.id === subId);

  const handleColorSelect = (i: number) => {
    setActiveColor(i);
    const variantImg = product.colorVariants[i]?.image;
    if (variantImg) {
      const imgIdx = product.images.findIndex((img) => img === variantImg);
      if (imgIdx >= 0) setActiveImg(imgIdx);
    }
  };

  const currentImage = product.images[activeImg] ?? product.images[0];

  return (
    <div style={KIOSK_STYLE}>
      <HFHeader small />
      <PurpleBanner>{category.label}</PurpleBanner>
      <MainMenuBtn onClick={onHome} />
      <div style={{ 
          background: "#5a2d82", 
          padding: "16px 48px", 
          textAlign: "center", 
          flexShrink: 0 
          }}
          >
        <span style={{ 
            ...typography.heading,
            color: "#fff", 
            letterSpacing: 3,
           }}
           >
          {sub?.label.toUpperCase() ?? ""}
        </span>
      </div>

      {/* Image viewer */}
      <div style={{ display: "flex", padding: "28px 48px 0", gap: 24, flexShrink: 0 }}>
        {/* Thumbnails */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              style={{
                width: 120, height: 120,
                border: activeImg === i ? "3px solid #5a2d82" : "2px solid #ddd",
                borderRadius: 8, overflow: "hidden", background: "#f0ede8",
                cursor: "pointer", padding: 0, flexShrink: 0, boxSizing: "border-box",
              }}
            >
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: 6, boxSizing: "border-box" }} />
            </button>
          ))}
        </div>
        {/* Main image */}
        <div style={{ flex: 1, background: "#f0ede8", borderRadius: 12, overflow: "hidden", aspectRatio: "1/1" }}>
          <img src={currentImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: 24, boxSizing: "border-box", transition: "opacity 0.25s ease" }} />
        </div>
      </div>

      {/* Product name strip */}
      <div style={{ background: "#5a2d82", margin: "20px 48px 0", borderRadius: 8, padding: "14px 24px", flexShrink: 0 }}>
        <span style={{ color: "#fff", ...typography.productNameStri}}>
          {product.name} &nbsp; {product.subtitle}
        </span>
      </div>

      {/* Details */}
      <div style={{ padding: "24px 48px 0", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#fff", border: "2px solid #e0dbd5", borderRadius: 12, overflow: "hidden" }}>
          {[["PRICE:", `₱${product.price.toLocaleString()}.00`], ["STOCK:", `${product.stock}`]].map(([label, value], i) => (
            <div key={i} style={{ padding: "24px 28px", borderRight: i === 0 ? "2px solid #e0dbd5" : "none" }}>
              <span style={{ ...typography.productDetailsLabel }}>{label} </span>
              <span style={{ ...typography.productDetailsSubLabel }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "2px solid #e0dbd5", borderRadius: 12, padding: "22px 28px", marginTop: 16 }}>
          <span style={{ ...typography.productDetailsLabel }}>SKU: </span>
          <span style={{ ...typography.productDetailsSubLabel }}>{product.sku}</span>
        </div>
        <div style={{ background: "#fff", border: "2px solid #e0dbd5", borderRadius: 12, padding: "22px 28px", marginTop: 16 }}>
          <span style={{ ...typography.productDetailsLabel }}>COLOR VARIANTS: </span>
          <span style={{ ...typography.productDetailsSubLabel }}>{product.colorVariants.map((v) => v.label).join(" and ")}</span>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {product.colorVariants.map((variant, i) => (
              <button
                key={i}
                onClick={() => handleColorSelect(i)}
                style={{
                  width: 100, height: 80,
                  border: activeColor === i ? "4px solid #5a2d82" : "2px solid #ccc",
                  borderRadius: 8, overflow: "hidden", background: "#f0ede8",
                  cursor: "pointer", padding: 0, boxSizing: "border-box",
                }}
              >
                <img src={variant.image} alt={variant.label} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: 4, boxSizing: "border-box" }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom buttons */}
      <div style={{ background: "#fff", borderTop: "2px solid #e0dbd5", padding: "28px 48px", display: "flex", gap: 24, flexShrink: 0 }}>
        <button onClick={onBack} style={{ flex: 1, background: "#5a2d82", border: "none", borderRadius: 8, padding: "26px 0", color: "#fff", cursor: "pointer", ...typography.button}}>
          BACK
        </button>
        <button
          onClick={() => onOrder(product, product.colorVariants[activeColor]?.label ?? "", 1)}
          style={{ flex: 1, background: "#5a2d82", border: "none", borderRadius: 8, padding: "26px 0", color: "#fff", cursor: "pointer", ...typography.button }}
        >
          ORDER ITEM
        </button>
      </div>
    </div>
  );
}
