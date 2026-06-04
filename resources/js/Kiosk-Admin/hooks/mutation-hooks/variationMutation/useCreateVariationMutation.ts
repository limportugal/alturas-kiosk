import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { CreateVariationServices } from '@/Kiosk-Admin/services/variation/CreateVariationServices';

interface UseCreateVariationMutationOptions {
    onSuccess?: () => void;
}

export const useCreateVariationMutation = (options?: UseCreateVariationMutationOptions) => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn:  CreateVariationServices,
        mutationKey: ['variation-list'],
        onSuccess: () => {
            showToast({ message: 'Variation created successfully', type: 'success' });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to create variation',
                type: 'error',
            });
        },
    });
};
