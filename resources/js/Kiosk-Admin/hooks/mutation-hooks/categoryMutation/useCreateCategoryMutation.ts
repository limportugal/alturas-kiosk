import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { CreateCategortServices } from '@/Kiosk-Admin/services/category/CreateCategoryServices';

interface UseCreateCategoryMutationOptions {
  onSuccess?: () => void;
}

export const useCreateCategoryMutation = (
    options?: UseCreateCategoryMutationOptions
) => {
    
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: CreateCategortServices,
        mutationKey: ['category-list'],
        onSuccess:() => {
            showToast({
                message: "Category created successfully",
                type: "success",
            });
            
            options?.onSuccess?.();
        },
            onError: (error: any) => {
            console.error("create product error", error);

            showToast({
                message: error?.response?.data?.message ?? "Failed to create product",
                type: "error",
            });
            },
    });

}