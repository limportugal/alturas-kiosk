import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { SubCategoryReOrderingService } from '@/Kiosk-Admin/services/subcategory/SubCategoryReOrderServices';

export const useReOrderSubCategoryMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
         mutationFn: SubCategoryReOrderingService,
            mutationKey: ["sub-category-reorder"],
            onSuccess: () => {
              showToast({
                message: "SubCategory re-order successfully",
                type: "success",
              });
            },
            onError: (error: any) => {
              showToast({
                message:
                  error?.response?.data?.message ?? "Failed to re order subcategory",
                type: "error",
              });
            },
    });
}
