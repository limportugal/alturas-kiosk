import { useSubCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-subcategory';
import type { CreateSubCategoryPayload } from '@/Kiosk-Admin/types/subcategory-types';

type SubCategoryState = ReturnType<typeof useSubCategoryStore.getState>;

export const buildCreateSubCategoryPayload = (
    state: SubCategoryState,
    image?: File
): CreateSubCategoryPayload => ({
    item_category_id: state.item_category_id,
    name:             state.name ?? '',
    image_path:       image,
    status:           state.status ?? 'Active',
});
