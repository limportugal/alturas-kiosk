import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { CategoryReOrderingService } from '@/Kiosk-Admin/services/category/CategoryReOrderServices';

export const useReOrderCategoryMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
         mutationFn: CategoryReOrderingService,
            mutationKey: ["category-reorder"],
            onSuccess: () => {
              showToast({
                message: "Category re-order successfully",
                type: "success",
              });
            },
            onError: (error: any) => {
              showToast({
                message:
                  error?.response?.data?.message ?? "Failed to re order category",
                type: "error",
              });
            },
    });
}
