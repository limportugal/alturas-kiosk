import { useVariationStore } from '@/Kiosk-Admin/hooks/zustands/use-store-variation';
import type { CreateVariationPayload } from '@/Kiosk-Admin/types/variation-types';

type VariationState = ReturnType<typeof useVariationStore.getState>;

export const buildCreateVariationPayload = (
    state: VariationState,
    image?: File
): CreateVariationPayload => ({
    name:       state.name ?? '',
    image_path: image,
    status:     state.status ?? 'Active',
});
