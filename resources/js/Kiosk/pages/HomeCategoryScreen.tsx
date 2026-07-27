import { useState, useEffect } from "react";
import { KIOSK_STYLE } from "@/Kiosk/components/shared";
import useDynamicQuery from "@/hooks/useDynamicQuery";
import { CategoriesPublicServices } from "@/Kiosk/services/category/GetCategoriesListServices";
import { CategoryList } from "@/Kiosk-Admin/types/category-types";
import { ImageCardButton } from "@/Kiosk/components/buttons/ImageCardButton";
import { typography } from "@/Kiosk/utils/typography";
import { colors } from "@/Kiosk/utils/colors";
import { CartIcon } from "@/Kiosk/components/CartIcon";
import { Badge } from "@/Kiosk/components/UI/Badge";
import { useCartStore } from "@/Kiosk/store/useCartStore";
import { ProductPublicServices } from "@/Kiosk/services/product/GetProductListServices";

import { ConfirmActionModal } from "@/Kiosk/modals/ConfirmActionModal";
import { useCart } from "@/Kiosk/hooks/useCart";
import { IMAGE_STANDARDS } from "@/Kiosk/utils/imageStandards";

export default function HomeCategoryScreen({
  onSelect,
  onViewOrder,
  onReturnToScreensaver,
}: {
  onSelect: (id: string, name: string) => void;
  onViewOrder: () => void;
  onReturnToScreensaver: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  const [ConfirmOpen, setConfirmOpen] = useState(false);
  const { clearCart }             = useCart();

  const { data: categories_data } = useDynamicQuery(
    ["category-public-list"],
    CategoriesPublicServices
  );

  const { data: publicData } = useDynamicQuery(
    ["product-list"],
    ProductPublicServices
  );

  const cartItems = useCartStore((s) => s.cartItems);

  // Count cart qty for all products belonging to a specific category
  const getCategoryCartQty = (categoryId: string) => {
    const productIds = publicData?.data
      ?.filter((p) => String(p.item_category_id) === categoryId)
      .map((p) => p.id) ?? [];
    return cartItems
      .filter((i) => productIds.includes(i.product_id))
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  useEffect(() => {
    if (!categories_data?.data?.length) return;
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [categories_data]);

  const handlePress = (id: string, name: string) => {
    setPressed(id);
    setTimeout(() => { setPressed(null); onSelect(id, name); }, 220);
  };

  return (
    <div style={KIOSK_STYLE}>
      {/* Header */}
      <div style={{
        background: colors.surface,
        padding: "16px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #e0dbd5",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        flexShrink: 0,
      }}>
        <div
          onClick={() => setConfirmOpen(true)}
          style={{ display: "inline-block", cursor: "pointer" }}
        >
            <img src="/images/LegacyFurniture-removebg-preview(1).png" alt="Legacy Furniture" style={{ height: 195, width: "auto" }} />
        </div>
      </div>

      {/* Banner */}
      <div style={{ background: colors.primary, padding: "28px 0", textAlign: "center", flexShrink: 0 }}>
        <span style={{ ...typography.heading, color: colors.surface, letterSpacing: 5 }}>
          PLEASE CHOOSE A CATEGORY BELOW
        </span>
      </div>

      {/* Grid */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        padding: "40px 40px 40px",
        boxSizing: "border-box",
        overflow: "auto",
        alignItems: "start",
        alignContent: "start",
      
      }}>
        {categories_data?.data
          ?.filter((cat) => cat.status === "Active")
          .map((cat: CategoryList, i: number) => {
            const col = (i % 2) as 0 | 1;
            const row = Math.floor(i / 2);
            const isPressed = pressed === String(cat.id);
            const slideFrom = col === 0 ? "-120%" : "120%";
            const staggerDelay = row * 120 + col * 60;
            const cardTransform = !mounted
              ? `translateX(${slideFrom})`
              : isPressed ? "translateX(0) scale(0.97)" : "translateX(0) scale(1)";
            const cardTransition = !mounted
              ? "none"
              : `transform ${isPressed ? "0.12s" : "0.55s"} cubic-bezier(0.22,1,0.36,1) ${!isPressed ? staggerDelay : 0}ms, opacity 0.45s ease ${staggerDelay}ms`;

            return (
              <div
                key={cat.id}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: cardTransform,
                  transition: cardTransition,
                  position: "relative",
                }}
              >
               
                <ImageCardButton
                  image={cat.image_path ? `/${cat.image_path}` : undefined}
                  label={cat.name}
                  active={isPressed}
                  onClick={() => handlePress(String(cat.id), cat.name)}
                  imageHeight={IMAGE_STANDARDS.categoryCard.displayHeight}
                />
                 <Badge value={getCategoryCartQty(String(cat.id))} show={getCategoryCartQty(String(cat.id)) > 0} />
              </div>
            );
          })} 
      </div>
      <CartIcon onClick={onViewOrder} hideWhenEmpty />

      <ConfirmActionModal
        open={ConfirmOpen}
        title="Return to Screen Saver"
        message={
          cartItems.length > 0
            ? "This will CLEAR your current cart. Continue?"
            : "Do you want to return to the screen saver?"
        }
        confirmLabel="Yes, Return"
        cancelLabel="Cancel"
        confirmTone={cartItems.length > 0 ? "danger" : "primary"}
        onConfirm={() => {
          if (cartItems.length > 0) clearCart();
          setConfirmOpen(false);
          onReturnToScreensaver();
        }}
        onClose={() => setConfirmOpen(false)}
        />
    </div>
  );
}
