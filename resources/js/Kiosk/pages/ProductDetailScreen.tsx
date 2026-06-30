import { useState } from "react";

import { HFHeader, MainMenuBtn, KIOSK_STYLE } from "@/Kiosk/components/shared";
import { PurpleBannerV2 } from "@/Kiosk/components/UI/PurpleBanner";
import { ArrowIcon } from "@/Kiosk/components/UI/ArrowIcon";
import { ThumbnailButton } from "@/Kiosk/components/buttons/ThumbnailButton";
import { KioskButton } from "@/Kiosk/components/buttons/KioskButton";
import { typography } from "@/Kiosk/utils/typography";
import { colors } from "@/Kiosk/utils/colors";
import { ProductItem } from "@/Kiosk-Admin/types/product-type";
import { ConfirmOrderModal } from "@/Kiosk/modals/ConfirmOrderModal";
import { CartIcon } from "@/Kiosk/components/CartIcon";
import { SoldOutOverlay } from "@/Kiosk/components/SoldOutState";
import { useCartStore } from "@/Kiosk/store/useCartStore";
import { Badge } from "@/Kiosk/components/UI/Badge";
import { formatMoney } from "@/Kiosk/components/shared";
import useDynamicQuery from "@/hooks/useDynamicQuery";
import { ProductPublicServices } from "@/Kiosk/services/product/GetProductListServices";

import  AutoShrinkText  from "@/Kiosk/components/AutoShrinkText";

export default function ProductDetailScreen({
  product,
  onBack,
  onHome,
  onViewOrder,
}: {
  product: ProductItem;
  subName?: { id: number; name: string; image_path?: string | null } | null;
  onBack: () => void;
  onHome: () => void;
  onViewOrder: () => void;
}) {
  const [activeImg, setActiveImg]         = useState(0);
  const [activeColor, setActiveColor]     = useState(-1);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [userPickedProductImg, setUserPickedProductImg] = useState(false);

  // ── Subscribe to product-list cache so stock updates propagate immediately
  // after confirmCart invalidates it — no extra network request (reuses cache)
  const { data: productListData } = useDynamicQuery(
    ["product-list"],
    ProductPublicServices,
    // { staleTime: 1000 * 10, refetchInterval: 1000 * 10 }
  );
  const freshProduct = productListData?.data?.find((p) => p.id === product.id) ?? product;

  const variants = freshProduct.color_variants ?? (product.color_variants ?? []);
  const images = product.images ?? [{image_path: ""}];
  const cartItems = useCartStore((s) => s.cartItems);




  // ── Live stock via polling ─────────────────────────────────────────────────
  const selectedColor = variants[activeColor]?.color_name ?? null;

  // Stock comes directly from product-list cache — updates immediately after confirmCart invalidates it
  const selectedVariant = variants.find((v) => v.color_name === selectedColor) ?? null;
  const productQty      = freshProduct.quantity;
  const variantQty      = selectedVariant?.quantity ?? null;

  // ── Primary product as a selectable "base" entry ───────────────────────────
  // activeColor === -1  → primary (product_items) is selected
  // activeColor >= 0    → a color variant is selected


  // On modal open, if primary is sold out auto-select first available variant
  const handleOpenCart = () => {
    if (activeColor === -1 && primarySoldOut) {
      const firstAvailable = variants.findIndex((v) => v.quantity > 0);
      if (firstAvailable >= 0) setActiveColor(firstAvailable);
    }
    setCartModalOpen(true);
  };

  const selectVariantImage = activeColor >= 0 && variants[activeColor]?.image_path
        ? `/${variants[activeColor].image_path}`
        : null;


  const selectProductImage = images[activeImg]?.image_path
      ? `/${images[activeImg].image_path}`
      : null;



  // variation_type is already eager-loaded on the product
  const variationTypeName = product.variation_type?.name ?? "";


  const mainDisplayImage = (!userPickedProductImg && selectVariantImage)
           ? selectVariantImage
           : selectProductImage ??  "https://placehold.co/600x600?text=No+Image";



  const handleColorSelect = (i: number) => {
    setActiveColor(i);
    setUserPickedProductImg(false);
  };
  const displayStock = variantQty !== null ? variantQty : productQty;

  const inCartQty = cartItems
      .filter((i) => i.product_id === product.id && (i.color ?? null) === (selectedColor))
      .reduce((sum,i) => sum + i.quantity, 0)

  const availableStock = Math.max(0, (displayStock ?? 0) - inCartQty);

  

  //  ── Helper to get cart quantity for a specific color ──
  const getCartQty = (color: string | null) =>
  cartItems
    .filter(
      (i) =>
        i.product_id === product.id &&
        (i.color ?? null) === color
    )
    .reduce((sum, i) => sum + i.quantity, 0);

    const primaryInCart = getCartQty(null);

    const primaryAvailable = Math.max(0, productQty - primaryInCart);

      const primarySoldOut = primaryAvailable <= 0;

  // ── Is the currently active selection sold out? ────────────────────────────
  const isSelectedSoldOut = activeColor === -1
    ? primarySoldOut
    : (() => {
        const v = variants[activeColor];
        if (!v) return false;
        const inCart = getCartQty(v.color_name);
        return (v.quantity - inCart) <= 0 || v.quantity <= 0;
      })();


  return (
    <div style={KIOSK_STYLE}>
      <HFHeader small />
        <div style={{ position: "relative"}}>
      <PurpleBannerV2 marquee marqueeInsetLeft={190} marqueeInsetRight={68}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 12}}>
        {variationTypeName.toUpperCase()}
        </div>
      </PurpleBannerV2>
        <KioskButton 
                onClick={onBack}  
                style={{
                  display: "flex",
                  flexDirection: "row",
                  position: 'absolute',
                  top: "8%",
                  left: -50,
                  height: 95,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  }}>
                      <ArrowIcon direction="left" size={35} label="BACK" />
                    
              </KioskButton>
      </div>
      <MainMenuBtn onClick={onHome} />
      {/* ── Stock dropped warning ── */}
      {/* {stockDropped && (
        <div style={{ background: "#fff3cd", color: "#856404", padding: "10px 48px", fontSize: 13, fontWeight: 600, textAlign: "center", flexShrink: 0 }}>
          ⚠ Stock just updated — please review your selection
        </div>
      )} */}
      {/* <div style={{  
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
      </div> */}
        {/* <div style={{ 
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
          {activeVariationType?.name.toUpperCase() ?? ""}
        </span>
      </div> */}

      {/* Image viewer */}
      <div style={{ display: "flex", padding: "28px 48px 0", gap: 24, flexShrink: 0 }}>
        {/* Thumbnails */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          {images.map((img, i) => (
            <ThumbnailButton
              key={i}
              image={img.image_path ? `/${img.image_path}` : "/images/placeholder.png"}
              active={activeImg === i}
              onClick={() => {setActiveImg(i); setUserPickedProductImg(true); }} //  onClick={() => {setActiveImg(i); setActiveColor(-1);}} auto select default when browsing side images , this only backup if wants to autoselect default
              width={120}
              height={120}
            />
          ))}
        </div>
        {/* Main image */}
        <div style={{ flex: 1, background: colors.surface, borderRadius: 12, overflow: "hidden", aspectRatio: "1/1" }}>
          <img src={mainDisplayImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: 24, boxSizing: "border-box", transition: "opacity 0.25s ease" }} />
        </div>
      </div>

      {/* Product name strip */}
      <div style={{ background: colors.primary, margin: "20px 48px 0", borderRadius: 8, padding: "14px 24px", flexShrink: 0 }}>
        <span style={{ color: colors.surface, ...typography.productNameStri}}>
          {product.name}
        </span>
      </div>

      {/* Details */}
      <div style={{ padding: "24px 48px 0", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: colors.surface, border: "2px solid #e0dbd5", borderRadius: 12, overflow: "hidden" }}>
          {[["PRICE:", formatMoney(product.price)], ["STOCK:", `${availableStock}`]].map(([label, value], i) => (
            <div key={i} style={{ padding: "24px 28px", borderRight: i === 0 ? "2px solid #e0dbd5" : "none" }}>
              <span style={{ ...typography.productDetailsLabel, color:colors.heading }}>{label} </span>
              <span style={{ ...typography.productDetailsSubLabel, color: i === 1 && availableStock <= 0 ? "#e53e3e" : colors.heading }}>{value}</span>
              {/* {i === 1 && availableStock <= 0 && (
                <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, color: "#e53e3e" }}>
                  Sold out
                </span>
              )} */}
            </div>
          ))}
        </div>
        <div style={{ background: colors.surface, border: "2px solid #e0dbd5", borderRadius: 12, padding: "22px 28px", marginTop: 16 }}>
          <span style={{ ...typography.productDetailsLabel }}>
            <AutoShrinkText>
            SKU: 
            </AutoShrinkText>
            </span>
          <span style={{ ...typography.productDetailsSubLabel }}>{product.sku}</span>
        </div>
        <div style={{ background: colors.surface, border: "2px solid #e0dbd5", borderRadius: 12, padding: "22px 28px", marginTop: 16 }}>
          <span style={{ ...typography.productDetailsLabel }}>COLOR VARIANTS: </span>
          {/* <span style={{ ...typography.productDetailsSubLabel }}>
            {variants.map((v) => v.color_name).join(" and ")}
            </span> */}
           <div style={{ display: "flex", gap: 16, marginTop: 16 }}>

              {/* ── Primary / base product entry — only show when product has color variants ── */}
              {/* {variants.length > 0 && ( )} this code is for displaying default product when has color variants */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 150, position: "relative"}}>
              
                <SoldOutOverlay soldOut={primarySoldOut} badgePosition="bottom-left" onClick={() => { setActiveColor(-1); setActiveImg(0); }}>
                  <ThumbnailButton
                    image={images[0]?.image_path ? `/${images[0].image_path}` : "/images/placeholder.png"}
                    alt="Default"
                    active={activeColor === -1}
                    onClick={() => { setActiveColor(-1); setActiveImg(0); }}
                    width={150}
                    height={100}
                  />
                </SoldOutOverlay>
                  <Badge value={getCartQty(null)} show={getCartQty(null) > 0} />
                <span style={{ fontSize: 14, fontWeight: 600, color: primarySoldOut ? "#aaa" : colors.heading, letterSpacing: 0.5, width: "100%", textAlign: "center", wordBreak: "break-word", lineHeight: 1.4, display: "block" }}>
                  {product.item_description}
                  {/* {primarySoldOut && <span style={{ color: "#e53e3e", marginLeft: 4, fontSize: 10 }}>• Sold out</span>} */}
                </span>
              </div>
             
            
              {variants.map((variant, i) => {
                // ── Per-variant sold out check — includes items already in cart ──
                const variantInCart = cartItems
                    .filter((ci) => ci.product_id === product.id && (ci.color ?? null) === variant.color_name)
                    .reduce((sum, ci) => sum + ci.quantity, 0);

                const variantSoldOut = (variant.quantity - variantInCart) <= 0 || variant.quantity <= 0;

                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 150, position: "relative" }}>
                    {/* SoldOutOverlay wraps only the thumbnail image */}
                  
                    <SoldOutOverlay
                      soldOut={variantSoldOut}
                      badgePosition="bottom-left"
                      onClick={() => handleColorSelect(i)}
                    >
                      <ThumbnailButton
                        image={variant.image_path ? `/${variant.image_path}` : "/images/placeholder.png"}
                        alt={variant.color_name}
                        active={activeColor === i}
                        onClick={() => handleColorSelect(i)}
                        width={150}
                        height={100}
                      />
                    </SoldOutOverlay>
                     <Badge value={variantInCart} show={variantInCart > 0} />

                    {/* Color name below thumbnail */}
                    <span style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: variantSoldOut ? "#aaa" : colors.heading,
                      letterSpacing: 0.5,
                      width: "100%",
                      textAlign: "center",
                      wordBreak: "break-word",
                      lineHeight: 1.4,
                      display: "block",
                    }}>
                      {variant.color_name}
                      {/* {variantSoldOut && (
                        <span style={{ color: "#e53e3e", marginLeft: 4, fontSize: 10 }}>• Sold out</span>
                      )} */}
                    </span>
                  </div>
                );
              })}
            </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom buttons */}
      <div style={{ background: colors.surface, borderTop: "2px solid #e0dbd5", padding: "28px 48px", display: "flex", gap: 24, flexShrink: 0 }}>
        {/* <KioskButton onClick={onBack} style={{ flex: 1 }}>BACK</KioskButton> */}
        <KioskButton onClick={handleOpenCart} disabled={isSelectedSoldOut}>ADD TO CART</KioskButton>
          <CartIcon onClick={onViewOrder} grayWhenEmpty />
      </div>
      
      <ConfirmOrderModal
          product={cartModalOpen ? product : null}
          selectedColor={variants[activeColor]?.color_name ?? null}
          onClose={() => setCartModalOpen(false)}
          onConfirmed={onBack}
        />
      
    </div>
    
  );
}
