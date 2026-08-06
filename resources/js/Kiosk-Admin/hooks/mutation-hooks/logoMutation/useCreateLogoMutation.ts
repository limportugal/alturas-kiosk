import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { CreateLogoService } from '@/Kiosk-Admin/services/logo/CreateLogoServices';
import { router } from '@inertiajs/react'; 

interface UseCreateLogoMutationsProps {
    onSuccess?: () => void;
}

export const useCreateLogoMutation = (options?: UseCreateLogoMutationsProps) => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: CreateLogoService,
        mutationKey: ['logo-list'],
        onSuccess: () => {
            showToast({ message: 'Logo added successfully', type: 'success' });

            router.reload({only: ['app'] });
            
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to add logo',
                type: 'error',
            });
        },
    });
};
