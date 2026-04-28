import { useState } from "react";

import { Screen, Product } from "@/Kiosk/types/types";
import { CATEGORIES } from "@/Kiosk/data";
import CategoryScreen from "@/Kiosk/components/CategoryScreen";
import SubCategoryScreen from "@/Kiosk/components/SubCategoryScreen";
import ProductScreen from "@/Kiosk/components/ProductScreen";
import HomeScreen from "@/Kiosk/components/HomeScreen";

import OrderModal from "@/Kiosk/modals/OrderModal";
import ConfirmationModal from "@/Kiosk/modals/ConfirmationModal";



// ── ROOT ───────────────────────────────────────────
export default function MainPage() {
  const [screen, setScreen]                   = useState<Screen>("home");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSubId, setActiveSubId]           = useState<string | null>(null);
  const [activeProduct, setActiveProduct]       = useState<Product | null>(null);
  const [orderProduct, setOrderProduct]         = useState<Product | null>(null);
  const [orderColor, setOrderColor]             = useState<string>("");
  const [showConfirm, setShowConfirm]           = useState(false);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId) ?? null;

  const goHome = () => {
    setScreen("home");
    setActiveCategoryId(null);
    setActiveSubId(null);
    setActiveProduct(null);
    setOrderProduct(null);
    setShowConfirm(false);
  };

  return (
    <div style={{ position: "relative", width: 1080, height: 1920, overflow: "hidden" }}>
      {screen === "home" && (
        <HomeScreen onSelect={(id) => { setActiveCategoryId(id); setScreen("category"); }} />
      )}
      {screen === "category" && activeCategory && (
        <CategoryScreen
          category={activeCategory}
          onBack={goHome}
          onSubSelect={(subId) => { setActiveSubId(subId); setScreen("subcategory"); }}
        />
      )}
      {screen === "subcategory" && activeCategory && activeSubId && (
        <SubCategoryScreen
          category={activeCategory}
          subId={activeSubId}
          onBack={() => setScreen("category")}
          onProduct={(p) => { setActiveProduct(p); setScreen("product"); }}
          onHome={goHome}
        />
      )}
      {screen === "product" && activeCategory && activeSubId && activeProduct && (
        <ProductScreen
          product={activeProduct}
          category={activeCategory}
          subId={activeSubId}
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
