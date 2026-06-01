import { useSubCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-subcategory';
import type { UpdateSubCategoryPayload } from '@/Kiosk-Admin/types/subcategory-types';

type SubCategoryState = ReturnType<typeof useSubCategoryStore.getState>;

export const buildUpdateSubCategoryPayload = (
    state: SubCategoryState,
    subCategoryId: number,
    image?: File,
    removeImage?: boolean
): UpdateSubCategoryPayload => ({
    id:               subCategoryId,
    item_category_id: state.item_category_id,
    name:             state.name ?? '',
    image_path:       image,
    status:           state.status ?? 'Active',
    remove_image:     removeImage ?? false,
});
