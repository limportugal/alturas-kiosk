import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { updateSubCatStatus } from '@/Kiosk-Admin/services/subcategory/UpdateSubCatStatusServices';

export const useSubCategoryToggleStatus = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn:  updateSubCatStatus,
        mutationKey: ['sub-category-list'],
        onSuccess: () => {
            showToast({ message: 'Sub-category status updated successfully.', type: 'success' });
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to change sub-category status',
                type: 'error',
            });
        },
    });
};
