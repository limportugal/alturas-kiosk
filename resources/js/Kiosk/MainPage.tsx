import { useState } from "react";

import { Screen, Product } from "@/Kiosk/types/types";
import { CATEGORIES } from "@/Kiosk/data";
import SubCategoryScreen from "@/Kiosk/pages/SubCategoryScreen";
import ProductScreen from "@/Kiosk/pages/ProductScreen";
import ProductDetailScreen from "@/Kiosk/pages/ProductDetailScreen";
import HomeCategoryScreen from "@/Kiosk/pages/HomeCategoryScreen";

import OrderModal from "@/Kiosk/modals/OrderModal";
import ConfirmationModal from "@/Kiosk/modals/ConfirmationModal";

import useDynamicQuery from "@/hooks/useDynamicQuery";
import { SubCategoriesPublicServices } from "@/Kiosk/services/sub-category/GetSubCategoriesListServices";
import { ProductItem } from "@/Kiosk-Admin/types/product-type";



// ── ROOT ───────────────────────────────────────────
export default function MainPage() {
  const [screen, setScreen]                   = useState<Screen>("home");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
  const [activeSubId, setActiveSubId]           = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [orderProduct, setOrderProduct]   = useState<ProductItem | null>(null);
  const [orderColor, setOrderColor]             = useState<string>("");
  const [showConfirm, setShowConfirm]           = useState(false);

  const activeCategory = CATEGORIES.find(
    (c) => c.label.toLowerCase() === (activeCategoryName ?? "").toLowerCase()
  ) ?? null;

  const { data: subCategoriesData } = useDynamicQuery(
    ["sub-category-public-list"],
    SubCategoriesPublicServices
  );

  const activeSubCategory = subCategoriesData?.data?.find(
    (s) => String(s.id) === activeSubId
  ) ?? null;

  const goHome = () => {
    setScreen("home");
    setActiveCategoryId(null);
    setActiveCategoryName(null);
    setActiveSubId(null);
    setActiveProduct(null);
    setOrderProduct(null);
    setShowConfirm(false);
  };

  return (
    <div style={{ position: "relative", width: 1080, height: 1920, overflow: "hidden" }}>
      {screen === "home" && (
        <HomeCategoryScreen onSelect={(id, name) => { setActiveCategoryId(id); setActiveCategoryName(name); setScreen("category"); }} />
      )}
      {screen === "category" && activeCategory && (
        <SubCategoryScreen
          category={activeCategory}
          categoryId={activeCategoryId ?? ""}
          onBack={goHome}
          onSubSelect={(subId) => { setActiveSubId(subId); setScreen("subcategory"); }}
        />
      )}
      {screen === "subcategory" && activeCategory && activeSubId && (
        <ProductScreen
          category={activeCategory}
          categoryId={activeCategoryId ?? ""}
          subId={activeSubId}
          onBack={() => setScreen("category")}
          onProduct={(p) => { setActiveProduct(p); setScreen("product"); }}
          onHome={goHome}
          varId=""
        />
      )}
      {screen === "product" && activeCategory && activeSubId && activeProduct && (
        <ProductDetailScreen
          product={activeProduct}
          subName={activeSubCategory}
          // category={activeCategory}
          // subId={activeSubId}
          onBack={() => setScreen("subcategory")}
          onHome={goHome}
          onOrder={(p, color) => { setOrderProduct(p); setOrderColor(color); }}
        />
      )}

      {orderProduct && !showConfirm && (
        <OrderModal
          product={orderProduct}
          color={orderColor}
          onConfirm={() => { setOrderProduct(null); setShowConfirm(true); }}
          onCancel={() => setOrderProduct(null)}
        />
      )}
      {showConfirm && <ConfirmationModal onClose={goHome} />}
    </div>
  );
}
