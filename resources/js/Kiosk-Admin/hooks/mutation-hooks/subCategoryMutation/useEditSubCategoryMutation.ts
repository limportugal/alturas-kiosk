import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { UpdateSubCategoryServices } from '@/Kiosk-Admin/services/private/subcategory/UpdateSubCategoryServices';

export const useEditSubCategoryMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn:  UpdateSubCategoryServices,
        mutationKey: ['sub-category-list'],
        onSuccess: () => {
            showToast({ message: 'Sub-category updated successfully', type: 'success' });
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to update sub-category',
                type: 'error',
            });
        },
    });
};
