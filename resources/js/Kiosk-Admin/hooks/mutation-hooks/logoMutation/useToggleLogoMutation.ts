import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { ToggleLogoStatusService } from '@/Kiosk-Admin/services/logo/ToggleLogoServices';

export const useToggleLogoMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: ToggleLogoStatusService,
        mutationKey: ['logo-list'],
        onSuccess: () => {
            showToast({ message: 'Logo status updated successfully', type: 'success' });
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to update logo status',
                type: 'error',
            });
        },
    });
};
