import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { UpdateVariationServices } from '@/Kiosk-Admin/services/variation/UpdateVariationServices';

export const useEditVariationMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn:  UpdateVariationServices,
        mutationKey: ['variation-list'],
        onSuccess: () => {
            showToast({ message: 'Variation updated successfully', type: 'success' });
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to update variation',
                type: 'error',
            });
        },
    });
};
