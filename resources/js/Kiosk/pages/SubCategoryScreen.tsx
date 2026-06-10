import { useState, useEffect } from "react";
import { CategoryData } from "../types/types";
import { HFHeader, PurpleBanner, MainMenuBtn, KIOSK_STYLE } from "../components/shared";
import { ImageCardButton } from "@/Kiosk/components/buttons/ImageCardButton";

import useDynamicQuery from "@/hooks/useDynamicQuery";
import { typography } from "@/Kiosk/utils/typography";
import { colors } from "@/Kiosk/utils/colors";
import { ScrollableGrid } from "@/Kiosk/components/scrollablegrid";
import { CartIcon } from "@/Kiosk/components/CartIcon";

import { Badge } from "@/Kiosk/components/UI/Badge";
import { useCartStore } from "@/Kiosk/store/useCartStore";

import { SubCategoriesPublicServices } from "@/Kiosk/services/sub-category/GetSubCategoriesListServices";
import { ProductPublicServices } from "@/Kiosk/services/product/GetProductListServices";

export default function SubCategoryScreen({
  category,
  categoryId,
  onBack,
  onSubSelect,
  onViewOrder,
}: {
  category: CategoryData;
  categoryId: string;
  onBack: () => void;
  onSubSelect: (subId: string) => void;
  onViewOrder: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  const { data: subCategoriesData } = useDynamicQuery(
    ["sub-category-public-list"],
    SubCategoriesPublicServices
  );

  const { data: publicData } = useDynamicQuery(
    ["product-list"],
    ProductPublicServices
  );

  const cartItems = useCartStore((s) => s.cartItems);

  // Count cart qty for all products belonging to a specific subcategory
  const getSubCategoryCartQty = (subCategoryId: string) => {
    const productIds = publicData?.data
      ?.filter((p) => String(p.sub_category_id) === subCategoryId)
      .map((p) => p.id) ?? [];
    return cartItems
      .filter((i) => productIds.includes(i.product_id))
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const visibleSubCategories =
    subCategoriesData?.data?.filter(
      (subCategory) => String(subCategory.item_category_id) === categoryId
    ) ?? [];

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [category.id]);

  const handlePress = (id: string) => {
    setPressed(id);
    setTimeout(() => { setPressed(null); onSubSelect(id); }, 220);
  };

  const slideDir = (col: number) => col === 0 ? "-130%" : col === 2 ? "130%" : "0%";
  const stagger  = (col: number, row: number) => row * 100 + col * 40;

  return (
    <div style={KIOSK_STYLE}>
      <HFHeader small />
      <PurpleBanner>{category.label}</PurpleBanner>
      <MainMenuBtn onClick={onBack} />

      {/* Hero card */}
      <div
        style={{
          margin: "32px 48px 0",
          display: "flex",
          gap: 20,
          background: colors.primary,
          borderRadius: 16,
          overflow: "hidden",
          flexShrink: 0,
          height: 200,
          alignItems: "stretch",
        }}
      >
        <div style={{ width: 300, flexShrink: 0, position: "relative", height: 200 }}>
          <img
            src={category.image}
            alt={category.label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              display: "block",
            }}
          />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(90,45,130,0.85)", padding: "14px 18px" }}>
            <span style={{ color: colors.surface, ...typography.title, letterSpacing: 2 }}>{category.label}</span>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "14px 20px 14px 0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <p
            style={{
              color: colors.surface,
              fontSize: 34,
              fontWeight: 700,
              margin: "0 0 10px",
              fontFamily: "Georgia, serif",
              lineHeight: 1.1,
            }}
          >
            Welcome to the {category.label.toLowerCase()} category!
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.88)",
              fontSize: 18,
              lineHeight: 1.35,
              margin: 0,
              overflowWrap: "break-word",
            }}
          >
            {category.description}
          </p>
        </div>
      </div>

      {/* Sub-category grid */}
      <ScrollableGrid columns={3} gap={28} padding="36px 48px">
        {visibleSubCategories.map((sub, index) => {
          const col = (index % 3) as 0 | 1 | 2;
          const row = Math.floor(index / 3);
          const isPressed = pressed === String(sub.id);
          const delay = stagger(col, row);
          const tx = !mounted ? slideDir(col) : isPressed ? "translateX(0) scale(0.95)" : "translateX(0) scale(1)";
          const tr = !mounted ? "none" : `transform ${isPressed ? "0.12s" : "0.5s"} cubic-bezier(0.22,1,0.36,1) ${!isPressed ? delay : 0}ms, opacity 0.4s ease ${delay}ms`;

          return (
            <div
              key={sub.id}
              style={{
                opacity: mounted ? 1 : 0,
                transform: tx,
                transition: tr,
                position: "relative",
              }}
            >
          
              <ImageCardButton
                image={sub.image_path ? `/${sub.image_path}` : undefined}
                label={sub.name}
                active={isPressed}
                onClick={() => handlePress(String(sub.id))}
                imageHeight={300}
              />
                  <Badge value={getSubCategoryCartQty(String(sub.id))} show={getSubCategoryCartQty(String(sub.id)) > 0} />
            </div>
          );
        })}
      </ScrollableGrid>
      <CartIcon onClick={onViewOrder} hideWhenEmpty />
    </div>

  );
}
