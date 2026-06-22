import { useCategoryStore } from "@/Kiosk-Admin/hooks/zustands/use-store-category";
import type { UpdateCategoryPayload } from "@/Kiosk-Admin/types/category-types";

type CategoryState = ReturnType<typeof useCategoryStore.getState>;

export const buildUpdateCategoryPayload = (
  state: CategoryState,
  categoryId: number,
  image?: File,
  removeImage?: boolean
): UpdateCategoryPayload => ({
  id: categoryId,
  name: state.name ?? "",
  description: state.description ?? "",
  image_path: image,
  status: state.status ?? "Active",
  remove_image: removeImage ?? false,
});
