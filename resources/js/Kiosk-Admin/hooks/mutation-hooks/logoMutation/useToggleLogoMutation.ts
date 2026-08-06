import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { ToggleLogoStatusService } from '@/Kiosk-Admin/services/logo/ToggleLogoServices';
import { router } from '@inertiajs/react';

export const useToggleLogoMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: ToggleLogoStatusService,
        mutationKey: ['logo-list'],
        onSuccess: () => {
            showToast({ message: 'Logo status updated successfully', type: 'success' });

            router.reload({only: ['app']});
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to update logo status',
                type: 'error',
            });
        },
    });
};
