import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { DeleteAdServices } from '@/Kiosk-Admin/services/ads/DeleteAdServices';

export const useDeleteAdMutation = () => {
    const { showToast } = useToast();
    return useDynamicMutation({
        mutationFn:  DeleteAdServices,
        mutationKey: ['ads-list'],
        onSuccess: () => {
            showToast({ message: 'Ad deleted', type: 'success' });
        },
        onError: (error: any) => {
            showToast({ message: error?.response?.data?.message ?? 'Failed to delete ad', type: 'error' });
        },
    });
};
