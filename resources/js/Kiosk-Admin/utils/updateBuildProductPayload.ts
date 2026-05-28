// services/buildUpdateProductPayload.ts
import { useProductStore } from "@/Kiosk-Admin/hooks/zustands/use-store-product";

type ProductState = ReturnType<typeof useProductStore.getState>;

export const buildUpdateProductPayload = (
  images: File[],
  state: ProductState,
  productId: number
) => {
  return {
    id: productId,
    item_code: state.item_code ?? "",
    name: state.name ?? "",
    sku: state.sku ?? "",
    item_category_id: state.item_category_id ?? 0,
    price: String(state.price ?? ""),
    quantity: String(state.quantity ?? ""),
    item_description: state.item_description ?? "",
    status: state.status ?? "",

    // new uploads only
    images,

    // optional: keep existing images if needed
    existing_images: state.existingImages, // if you store them
    removed_image_ids: state.removedImageIds,       // ← ids to delete on backend
  };
};