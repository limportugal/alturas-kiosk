import { CreateProductPayload, NewColorVariant } from "@/Kiosk-Admin/types/product-type";
import { useProductStore } from "@/Kiosk-Admin/hooks/zustands/use-store-product";

export const buildCreateProductPayload = (
  images: File[],
  colorVariants: NewColorVariant[],
  state: ReturnType<typeof useProductStore.getState>
): CreateProductPayload => {
  return {
    item_code:        state.item_code ?? "",
    name:             state.name ?? "",
    sku:              state.sku ?? "",
    item_category_id: Number(state.item_category_id ?? ""),
    sub_category_id:  state.sub_category_id ?? null,
    price:            String(state.price ?? ""),
    quantity:         String(state.quantity ?? ""),
    item_description: state.item_description ?? "",
    status:           state.status ?? "",
    images,
    color_variants:   colorVariants,
  };
};
