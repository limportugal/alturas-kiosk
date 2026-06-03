import { useState, useEffect } from "react";
import { CategoryData, Product } from "../types/types";

import useDynamicQuery from "@/hooks/useDynamicQuery";

import { HFHeader, PurpleBanner, MainMenuBtn, Stars, KIOSK_STYLE } from "@/Kiosk/components/shared";
import { ImageCardButton } from "@/Kiosk/components/buttons/ImageCardButton";
import { KioskButton } from "@/Kiosk/components/buttons/KioskButton";

import { ProductPublicServices } from "@/Kiosk/services/product/GetProductListServices";
import { SubCategoriesPublicServices } from "@/Kiosk/services/sub-category/GetSubCategoriesListServices";
import { CategoriesPublicServices } from "@/Kiosk/services/category/GetCategoriesListServices";

import { ProductItem } from "@/Kiosk-Admin/types/product-type";


export default function ProductScreen({
  category,
  categoryId,
  subId,
  onBack,
  onProduct,
  onHome,
}: {
  category: CategoryData;
  categoryId: string;
  subId: string;
  onBack: () => void;
  onProduct: (product: ProductItem) => void;
  onHome: () => void;
}) {
   const { data: publicData } = useDynamicQuery(
    ["product-public-list"],
    ProductPublicServices
  );

  const { data: subCategoriesData } = useDynamicQuery(
    ["sub-category-public-list"],
    SubCategoriesPublicServices
  );

    const { data: categories_data } = useDynamicQuery(
    ["category-public-list"],
    CategoriesPublicServices
  );
  
  const visibleProducts = publicData?.data?.filter((p) => String(p.sub_category_id) === subId) ?? [];
  const cat = categories_data?.data.find((c) => String(c.id) === subId);
  const subcat = subCategoriesData?.data.find((s) => String(s.id) === subId);
  const [activeTab, setActiveTab] = useState(0);
  const products = category.products[subId] ?? [];
  const [mounted, setMounted] = useState(false);

  

 
  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [subId]);

  return (
    <div style={KIOSK_STYLE}>
      <HFHeader small />
      <PurpleBanner>{cat?.name ??  "No Subcategory"}</PurpleBanner>
      <MainMenuBtn onClick={onHome} />
      <PurpleBanner small>{subcat?.name.toUpperCase() ?? subId.toUpperCase()}</PurpleBanner>

      {/* Tabs */}
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        gap:22, 
        padding:"24px 48px", 
        overflowX: "auto", 
        flexShrink: 0, 
        background: "#fff", 
        borderBottom: "1px solid #e0dbd5",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
        }}
        >
        {(subCategoriesData?.data?.filter((s) => String(s.item_category_id) === categoryId) ?? []).map((tab, i) => (
          <ImageCardButton
            key={tab.name}
            image={tab.image_path ? `/${tab.image_path}` : undefined}
            label={tab.name}
            active={activeTab === i}
            onClick={() => setActiveTab(i)}
            width={180} 
            imageHeight={120}
          />
        ))}
      </div>


      <PurpleBanner small>{category.subCategoryTabs[activeTab]?.label.toUpperCase() ?? ""}</PurpleBanner>

      {/* Product grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, alignContent: "start", boxSizing: "border-box" }}>
        {visibleProducts.map((product, idx) => {
          const col = idx % 3;
          const delay = col * 80 + Math.floor(idx / 3) * 100;
          const slideFrom = col === 0 ? "-110%" : col === 2 ? "110%" : "0%";

          return (
            <button
              key={product.id}
              onClick={() => onProduct(product)}
              style={{
                background: "#fff",
                border: "2px solid #e0dbd5",
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateX(0) scale(1)" : `translateX(${slideFrom})`,
                transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 0.4s ease ${delay}ms`,
              }}
            >
              {/* {product.isBestSeller && (
                <div style={{ background: "#e8333c", color: "#fff", fontSize: 18, fontWeight: 700, padding: "6px 16px", fontFamily: "Arial, sans-serif" }}>Best seller</div>
              )} */}
              {/* {product.tags?.map((tag) => (
                <div key={tag} style={{ color: "#c0392b", fontSize: 18, fontWeight: 600, padding: "6px 16px 0", fontFamily: "Arial, sans-serif" }}>{tag}</div>
              ))} */}
              <div style={{ background: "#f0ede8", aspectRatio: "1/1", overflow: "hidden" }}>
                <img src={
                  product.images?.[0]?.image_path
                    ? `/${product.images[0].image_path}`
                    : "https://placehold.co/600x600?text=No+Image"
                  } style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: 12, boxSizing: "border-box" }} />
              </div>
              <div style={{ padding: "16px 18px 20px", flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#111", fontFamily: "Arial, sans-serif" }}>{product.name}</div>
                {/* <div style={{ fontSize: 18, color: "#555", fontFamily: "Arial, sans-serif", marginTop: 4 }}>{product.subtitle}</div> */}
                <div style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Arial, sans-serif", marginTop: 10 }}>₱{product.price.toLocaleString()}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  {/* <Stars rating={product.rating} size={18} /> */}
                  {/* <span style={{ fontSize: 16, color: "#777", fontFamily: "Arial, sans-serif" }}>({product.reviewCount})</span> */}
                </div>
                <div style={{ marginTop: 10, fontSize: 17, color: "#2e7d32", fontFamily: "Arial, sans-serif", fontWeight: 600 }}>✓ Available for delivery</div>
                <div style={{ fontSize: 17, color: "#2e7d32", fontFamily: "Arial, sans-serif", fontWeight: 600 }}>✓ In stock in Pasay City</div>
              </div>
            </button>
          );
        })}
        {visibleProducts.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#aaa", fontSize: 28, padding: "80px 0", fontFamily: "Arial, sans-serif" }}>
            Products coming soon
          </div>
        )}
      </div>

      {/* Back */}
      <div style={{ background: "#fff", borderTop: "1px solid #e0dbd5", padding: "24px 48px", flexShrink: 0 }}>
        <KioskButton onClick={onBack}>← BACK</KioskButton>
      </div>
    </div>
  );
}
