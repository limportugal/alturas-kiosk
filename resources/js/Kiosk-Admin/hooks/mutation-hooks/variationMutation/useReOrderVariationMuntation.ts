import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { VariationsReOrderdingService } from '@/Kiosk-Admin/services/variation/ReorderVariationServices';


export const useReOrderVariationMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: VariationsReOrderdingService,
          mutationKey: ['variation-list'],
          onSuccess: () => {
            showToast({
                message: "Variation Re-Arrange succesfully",
                type: "success",
            });
          },
          onError:(error:any) => {
            showToast({
                message: error?.response?.data?.message ?? "Failed to Re-Arrange Item",
                type: "error",
            });
          },
    });
}