import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { UpdateAdServices } from '@/Kiosk-Admin/services/ads/UpdateAdServices';

export const useEditAdMutation = () => {
    const { showToast } = useToast();
    return useDynamicMutation({
        mutationFn:  UpdateAdServices,
        mutationKey: ['ads-list'],
        onSuccess: () => {
            showToast({ message: 'Ad updated successfully', type: 'success' });
        },
        onError: (error: any) => {
            showToast({ message: error?.response?.data?.message ?? 'Failed to update ad', type: 'error' });
        },
    });
};
