import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { UpdateCategoryServices } from '@/Kiosk-Admin/services/private/category/UpdateCategoryServices';

export const useEditCategoryMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
         mutationFn: UpdateCategoryServices,
            mutationKey: ["category-list"],
            onSuccess: () => {
              showToast({
                message: "Category updated successfully",
                type: "success",
              });
            },
            onError: (error: any) => {
              showToast({
                message:
                  error?.response?.data?.message ?? "Failed to update category",
                type: "error",
              });
            },
    });
}
