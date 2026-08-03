import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { ResetLogoService } from '@/Kiosk-Admin/services/logo/LogoServices';
import { router } from '@inertiajs/react';

interface UseResetLogoMutationsProps {
    onSuccess?: () => void;
}

export const useResetLogoMutation = (options?: UseResetLogoMutationsProps) => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: ResetLogoService,
        mutationKey: ['app-logo'],
        onSuccess: (data: { message: string }) => {
            showToast({ message: data.message ?? 'Logo reset to default', type: 'success' });
            router.reload();
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to reset logo',
                type: 'error',
            });
        },
    });
};
