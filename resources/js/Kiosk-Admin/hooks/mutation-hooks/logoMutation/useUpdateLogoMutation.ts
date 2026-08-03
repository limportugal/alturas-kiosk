import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { UpdateLogoService } from '@/Kiosk-Admin/services/logo/UpdateLogoServices';

interface UseUpdateLogoMutationsProps {
    onSuccess?: () => void;
}

export const useUpdateLogoMutation = (options?: UseUpdateLogoMutationsProps) => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: UpdateLogoService,
        mutationKey: ['logo-list'],
        onSuccess: () => {
            showToast({ message: 'Logo updated successfully', type: 'success' });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to update logo',
                type: 'error',
            });
        },
    });
};
