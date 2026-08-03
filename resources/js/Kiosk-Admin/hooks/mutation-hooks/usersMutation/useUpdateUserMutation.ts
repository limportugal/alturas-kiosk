import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { UpdateUserService } from '@/Kiosk-Admin/services/users/UpdateUsersServices';

interface UseUpdateUserMutationsProps {
    onSuccess?: () => void;
}

export const UseUpdateUserMutations = (options?: UseUpdateUserMutationsProps) => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: UpdateUserService,
        mutationKey: ['user-list'],
        onSuccess: () => {
            showToast({ message: 'User updated successfully', type: 'success' });
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showToast({
                message: error?.response?.data?.message ?? 'Failed to update user',
                type: 'error',
            });
        },
    });
};
