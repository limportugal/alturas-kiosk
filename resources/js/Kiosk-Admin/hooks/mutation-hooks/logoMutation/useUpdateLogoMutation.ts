import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { UpdateLogoService } from '@/Kiosk-Admin/services/logo/UpdateLogoServices';
import { router } from '@inertiajs/react'; 

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

            router.reload({only:['app']})
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
