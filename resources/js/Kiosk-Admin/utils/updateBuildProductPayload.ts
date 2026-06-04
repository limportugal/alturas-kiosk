import { useProductStore } from "@/Kiosk-Admin/hooks/zustands/use-store-product";
import { NewColorVariant } from "@/Kiosk-Admin/types/product-type";

type ProductState = ReturnType<typeof useProductStore.getState>;

export const buildUpdateProductPayload = (
  images: File[],
  colorVariants: NewColorVariant[],
  removedVariantIds: number[],
  state: ProductState,
  productId: number
) => {
  return {
    id:               productId,
    item_code:        state.item_code ?? "",
    name:             state.name ?? "",
    sku:              state.sku ?? "",
    item_category_id: state.item_category_id ?? 0,
    sub_category_id:  state.sub_category_id ?? null,
    variation_type_id: state.variation_type_id ?? null,
    price:            String(state.price ?? ""),
    quantity:         String(state.quantity ?? ""),
    item_description: state.item_description ?? "",
    status:           state.status ?? "",
    images,
    existing_images:     state.existingImages,
    removed_image_ids:   state.removedImageIds,
    color_variants:      colorVariants,
    removed_variant_ids: removedVariantIds,
  };
};
