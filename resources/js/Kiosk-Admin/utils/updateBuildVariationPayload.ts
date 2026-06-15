import { useVariationStore } from '@/Kiosk-Admin/hooks/zustands/use-store-variation';
import type { UpdateVariationPayload } from '@/Kiosk-Admin/types/variation-types';

type VariationState = ReturnType<typeof useVariationStore.getState>;

export const buildUpdateVariationPayload = (
    state: VariationState,
    variationId: number,
    image?: File,
    removeImage?: boolean
): UpdateVariationPayload => ({
    id:              variationId,
    sub_category_id: state.sub_category_id ?? null,
    name:            state.name ?? '',
    image_path:      image,
    status:          state.status ?? 'Active',
    remove_image:    removeImage ?? false,
});
