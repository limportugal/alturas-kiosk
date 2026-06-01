import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { CreateSubCategoryServices } from '@/Kiosk-Admin/services/private/subcategory/CreateSubCategoryServices';

interface UseCreateSubCategoryMutationOptions {
    onSuccess?: () => void;
}

export const useCreateSubCategoryMutation = (options?: UseCreateSubCategoryMutationOptions) => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn:  CreateSubCategoryServices,
        mutationKey: ['sub-category-list'],
        onSuccess: () => {
            showToast({ message: 'Sub-category created successfully', type: 'success' });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to create sub-category',
                type: 'error',
            });
        },
    });
};
