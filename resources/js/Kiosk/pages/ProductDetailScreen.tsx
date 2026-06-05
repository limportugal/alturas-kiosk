import { useState } from "react";
import { CategoryData, Product } from "@/Kiosk/types/types";
import { HFHeader, PurpleBanner, MainMenuBtn, KIOSK_STYLE } from "@/Kiosk/components/shared";

import { ThumbnailButton } from "@/Kiosk/components/buttons/ThumbnailButton";
import { KioskButton } from "@/Kiosk/components/buttons/KioskButton";

import { typography } from "@/Kiosk/utils/typography";
import { colors } from "@/Kiosk/utils/colors";

import { ProductItem} from "@/Kiosk-Admin/types/product-type";
import { VariationList } from "@/Kiosk-Admin/types/variation-types";


export default function ProductDetailScreen({
  product,
  // category,
  // subId,
  subName,
  onBack,
  onHome,
  onOrder,
  variantionType,
}: {
  product: ProductItem;
  subName?: { id: number; name: string; image_path?: string | null } | null
  categoryName?: Category; 
  variantionType?:VariationList;

  onBack: () => void;
  onHome: () => void;
  onOrder: (product: ProductItem, color: string, qty: number) => void;
}) {
  const [activeImg, setActiveImg]     = useState(0);
  const [activeColor, setActiveColor] = useState(-1);

  const variants = product.color_variants ?? [];

  const images = product.images ?? [{image_path: ""}];

  const currentImagePath = images[activeImg]?.image_path
    product.images?.[0]?.image_path
            ? `/${product.images[0].image_path}`
            : "https://placehold.co/600x600?text=No+Image"

  const selectVariantImage = activeColor >= 0 && variants[activeColor]?.image_path
        ? `/${variants[activeColor].image_path}`
        : null;


  const selectProductImage = images[activeImg]?.image_path
      ? `/${images[activeImg].image_path}`
      : null;


  const mainDisplayImage = selectVariantImage ?? selectProductImage ??  "https://placehold.co/600x600?text=No+Image";

      

  const handleColorSelect = (i: number) => {
    setActiveColor(i);
  };


  return (
    <div style={KIOSK_STYLE}>
      <HFHeader small />
      <PurpleBanner>{product.category_name ?? ""}</PurpleBanner>
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
            color:colors.surface, 
            letterSpacing: 3,
           }}
           >
          {subName?.name.toUpperCase() ?? ""}
        </span>
      </div>
        <div style={{ 
          background: "#5a2d82", 
          padding: "16px 48px", 
          textAlign: "center", 
          flexShrink: 0 
          }}
          >
        <span style={{ 
            ...typography.heading,
            color:colors.surface, 
            letterSpacing: 3,
           }}
           >
          {variantionType?.name.toUpperCase() ?? ""}
        </span>
      </div>

      {/* Image viewer */}
      <div style={{ display: "flex", padding: "28px 48px 0", gap: 24, flexShrink: 0 }}>
        {/* Thumbnails */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          {images.map((img, i) => (
            <ThumbnailButton
              key={i}
              image={img.image_path ? `/${img.image_path}` : "/images/placeholder.png"}
              active={activeImg === i}
              onClick={() => {setActiveImg(i); setActiveColor(-1);}}
              width={120}
              height={120}
            />
          ))}
        </div>
        {/* Main image */}
        <div style={{ flex: 1, background: colors.background, borderRadius: 12, overflow: "hidden", aspectRatio: "1/1" }}>
          <img src={mainDisplayImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: 24, boxSizing: "border-box", transition: "opacity 0.25s ease" }} />
        </div>
      </div>

      {/* Product name strip */}
      <div style={{ background: colors.primary, margin: "20px 48px 0", borderRadius: 8, padding: "14px 24px", flexShrink: 0 }}>
        <span style={{ color: colors.surface, ...typography.productNameStri}}>
          {product.name} &nbsp; {product.item_description}
        </span>
      </div>

      {/* Details */}
      <div style={{ padding: "24px 48px 0", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: colors.surface, border: "2px solid #e0dbd5", borderRadius: 12, overflow: "hidden" }}>
          {[["PRICE:", `₱${product.price.toLocaleString()}.00`], ["STOCK:", `${product.quantity}`]].map(([label, value], i) => (
            <div key={i} style={{ padding: "24px 28px", borderRight: i === 0 ? "2px solid #e0dbd5" : "none" }}>
              <span style={{ ...typography.productDetailsLabel, color:colors.heading }}>{label} </span>
              <span style={{ ...typography.productDetailsSubLabel, color:colors.heading }}>{value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: colors.surface, border: "2px solid #e0dbd5", borderRadius: 12, padding: "22px 28px", marginTop: 16 }}>
          <span style={{ ...typography.productDetailsLabel }}>SKU: </span>
          <span style={{ ...typography.productDetailsSubLabel }}>{product.sku}</span>
        </div>
        <div style={{ background: colors.surface, border: "2px solid #e0dbd5", borderRadius: 12, padding: "22px 28px", marginTop: 16 }}>
          <span style={{ ...typography.productDetailsLabel }}>COLOR VARIANTS: </span>
          <span style={{ ...typography.productDetailsSubLabel }}>{variants.map((v) => v.color_name).join(" and ")}</span>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {variants.map((variant, i) => (
              <ThumbnailButton
                key={i}
                image={variant.image_path ? `/${variant.image_path}` : "/images/placeholder.png"}
                alt={variant.color_name}
                active={activeColor === i}
                onClick={() => handleColorSelect(i)}
                width={100}
                height={80}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom buttons */}
      <div style={{ background: colors.surface, borderTop: "2px solid #e0dbd5", padding: "28px 48px", display: "flex", gap: 24, flexShrink: 0 }}>
        <KioskButton onClick={onBack} style={{ flex: 1 }}>BACK</KioskButton>
        <KioskButton onClick={() => onOrder(product, variants[activeColor]?.color_name ?? "", 1)} style={{ flex: 1 }}>ORDER ITEM</KioskButton>
      </div>
    </div>
  );
}
