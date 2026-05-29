import type { CreateCategoryPayload } from '@/Kiosk-Admin/types/category-types';
import { useCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-category';

type CategoryState = ReturnType<typeof useCategoryStore.getState>;

export const buildCreateCategoryPayload = (
  state: CategoryState,
  image?: File
): CreateCategoryPayload => ({
  name: state.name ?? "",
  image_path: image,
  status: state.status ?? "Active",
});