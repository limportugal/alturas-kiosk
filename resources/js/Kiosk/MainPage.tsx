import { useEffect, useState } from "react";

import { Screen, Product } from "@/Kiosk/types/types";
import { CATEGORIES } from "@/Kiosk/data";
import SubCategoryScreen from "@/Kiosk/pages/SubCategoryScreen";
import ProductScreen from "@/Kiosk/pages/ProductScreen";
import ProductDetailScreen from "@/Kiosk/pages/ProductDetailScreen";
import HomeCategoryScreen from "@/Kiosk/pages/HomeCategoryScreen";
import { IdleModal } from "@/Components/Modals/IdleModal";

import OrderModal from "@/Kiosk/modals/OrderModal";
import ConfirmationModal from "@/Kiosk/modals/ConfirmationModal";
import { CartSummaryModal } from "@/Kiosk/modals/CartSummaryModal";

import useDynamicQuery from "@/hooks/useDynamicQuery";
import { SubCategoriesPublicServices } from "@/Kiosk/services/sub-category/GetSubCategoriesListServices";
import { CategoriesPublicServices } from "@/Kiosk/services/category/GetCategoriesListServices";
import { ProductPublicServices } from "@/Kiosk/services/product/GetProductListServices";
import { ProductVariationsPublicServices } from "@/Kiosk/services/product/GetProductVariationListServices";
import { ProductItem } from "@/Kiosk-Admin/types/product-type";




// ── ROOT ───────────────────────────────────────────
interface MainPageProps {
  idleTimeoutMs?: number;
  onIdleReset: () => void;
  entryProductId?: number | string | null;
  onEntryProductHandled?: () => void;
  onReturnToScreensaver:() => void;
}

export default function MainPage({ idleTimeoutMs, onIdleReset, entryProductId, onEntryProductHandled, onReturnToScreensaver }: MainPageProps) {
  const [screen, setScreen]                   = useState<Screen>("home");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
  const [activeSubId, setActiveSubId]           = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [orderProduct, setOrderProduct]   = useState<ProductItem | null>(null);
  const [orderColor, setOrderColor]             = useState<string>("");
  const [showConfirm, setShowConfirm]           = useState(false);
  const [summaryOpen, setSummaryOpen]           = useState(false);



  // ── Prefetch all data on mount so child screens load instantly ──────────────
  const { data: subCategoriesData } = useDynamicQuery(
    ["sub-category-public-list"],
    SubCategoriesPublicServices
  );
  // These results are cached — child screens reuse them without re-fetching
  const { data: categoriesData } = useDynamicQuery(["category-public-list"], CategoriesPublicServices);
  const { data: productsData }   = useDynamicQuery(["product-list"], ProductPublicServices);
  useDynamicQuery(["variations-public-list"],  ProductVariationsPublicServices);

  const activeSubCategory = subCategoriesData?.data?.find(
    (s) => String(s.id) === activeSubId
  ) ?? null;

    const selectedDbCategory = categoriesData?.data?.find(
    (category) => String(category.id) === activeCategoryId
  );

  const activeCategory = selectedDbCategory ? {
    id: String(selectedDbCategory.id),
    label: selectedDbCategory.name,
    image: selectedDbCategory.image_path
      ? `${selectedDbCategory.image_path}`
      : "/images/placeholder.png", 
    description: selectedDbCategory.description ?? "", 
    subCategories: [],
    subCategoryTabs: [],
    products: {},
  } : null ;


  

  const goHome = () => {
    setScreen("home");
    setActiveCategoryId(null);
    setActiveCategoryName(null);
    setActiveSubId(null);
    setActiveProduct(null);
    setOrderProduct(null);
    setShowConfirm(false);
    setSummaryOpen(false);
  };

  const handleOrderPlaced = () => {
    setSummaryOpen(false);
    setShowConfirm(true);
  };

   const handleConfirmationClose = () => {
  setShowConfirm(false);
  onReturnToScreensaver();
  };
 

  useEffect(() => {
    if (!entryProductId || activeProduct) return;

    const selectedProduct = productsData?.data?.find(
      (product) => String(product.id) === String(entryProductId)
    );

    if (!selectedProduct) return;

    const selectedCategory = categoriesData?.data?.find(
      (category) => category.id === selectedProduct.item_category_id
    );

    setActiveProduct(selectedProduct);
    setActiveSubId(
      selectedProduct.sub_category_id != null
        ? String(selectedProduct.sub_category_id)
        : null
    );
    setActiveCategoryId(String(selectedProduct.item_category_id));
    setActiveCategoryName(selectedCategory?.name ?? null);
    setScreen("product");
    onEntryProductHandled?.();
  }, [entryProductId, productsData, categoriesData, activeProduct, onEntryProductHandled]);

  return (
    <div style={{ position: "relative", width: 1080, height: 1920, overflow: "hidden" }}>
      {screen === "home" && (
        <HomeCategoryScreen
          onSelect={(id, name) => { setActiveCategoryId(id); setActiveCategoryName(name); setScreen("category"); }}
          onViewOrder={() => setSummaryOpen(true)}
        />
      )}
      {screen === "category" && activeCategory && (
        <SubCategoryScreen
          category={activeCategory}
          categoryId={activeCategoryId ?? ""}
          onBack={goHome}
          onSubSelect={(subId) => { setActiveSubId(subId); setScreen("subcategory"); }}
          onViewOrder={() => setSummaryOpen(true)}
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
          onViewOrder={() => setSummaryOpen(true)}
        />
      )}
      {screen === "product" && activeCategory && activeSubId && activeProduct && (
        <ProductDetailScreen
          product={activeProduct}
          subName={activeSubCategory}
          onBack={() => setScreen("subcategory")}
          onHome={goHome}
          onViewOrder={() => setSummaryOpen(true)}
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
      {showConfirm && <ConfirmationModal onClose={handleConfirmationClose} />}
      <CartSummaryModal 
            open={summaryOpen} 
            onClose={() => setSummaryOpen(false)} 
            onPlaceOrder={handleOrderPlaced}
        />
      <IdleModal idleTimeoutMs={idleTimeoutMs} onReset={onIdleReset} />
    </div>
  );
}
