import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { updateStatus } from '@/Kiosk-Admin/services/private/products/UpdateStatusServices';

import { useToast } from "@/hooks/use-toast";

export const useToggleProductStatus = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: updateStatus,
        mutationKey: ["product-list"],
        onSuccess: () => {
          showToast({
            message: "Product status changed successfully",
            type: "success",
        });
        },
        onError:(error: any) => {
            console.error("change status product error", error);

            showToast({
                message: error?.response?.data?.message ?? "Failed to change status product",
                type: "error",
            }); 
        },
    });
}