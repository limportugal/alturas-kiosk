import { useDynamicMutation } from '@/hooks/useDynamicMutation';
import { useToast } from '@/hooks/use-toast';
import { CreateUserService } from '@/Kiosk-Admin/services/users/CreateUsersServices';


interface UseCreateUserMutationsProps{
    onSuccess?: () => void;
}

export const UseCreateUserMutations = (options?: UseCreateUserMutationsProps) => {
    const {showToast} = useToast();

    return useDynamicMutation({
        mutationFn: CreateUserService,
        mutationKey: ['user-list'],
        onSuccess: () => {
            showToast({message:'user created successfully', type: 'success'});
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            showToast
            ({
                message: error?.response?.data?.message ?? 'Failed to create user', 
                type: 'error'
            });
        },
    });
};