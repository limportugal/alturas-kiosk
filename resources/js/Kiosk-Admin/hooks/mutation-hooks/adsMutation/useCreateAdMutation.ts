import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { CreateAdServices } from '@/Kiosk-Admin/services/ads/CreateAdServices';

interface Options { onSuccess?: () => void; }

export const useCreateAdMutation = (options?: Options) => {
    const { showToast } = useToast();
    return useDynamicMutation({
        mutationFn:  CreateAdServices,
        mutationKey: ['ads-list'],
        onSuccess: () => {
            showToast({ message: 'Ad created successfully', type: 'success' });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showToast({ message: error?.response?.data?.message ?? 'Failed to create ad', type: 'error' });
        },
    });
};
