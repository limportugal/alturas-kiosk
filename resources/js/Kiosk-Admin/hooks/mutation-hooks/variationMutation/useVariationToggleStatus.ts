import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { updateVariationStatus } from '@/Kiosk-Admin/services/variation/UpdateVariationStatusServices';

export const useVariationToggleStatus = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn:  updateVariationStatus,
        mutationKey: ['variation-list'],
        onSuccess: () => {
            showToast({ message: 'Variation status updated successfully.', type: 'success' });
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to change variation status',
                type: 'error',
            });
        },
    });
};
