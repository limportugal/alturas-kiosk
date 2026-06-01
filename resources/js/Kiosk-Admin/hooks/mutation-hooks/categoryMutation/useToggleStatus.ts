import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { updateCatStatus } from '@/Kiosk-Admin/services/private/category/UpdateCatStatusServices';

import { useToast } from "@/hooks/use-toast";

export const useToggleStatus = () => {
      const { showToast } = useToast();
    
      return useDynamicMutation({
        mutationFn: updateCatStatus,
        mutationKey: ['category-list'],
        onSuccess: () => {
          showToast({
            message: "Category status updated successfully.",
            type: "success"
          });
        },
        onError: (error:any) => {
            showToast({
                message: error?.response?.data?.message ?? "Failed to change category status",
                type: "error",
            }); 
        },
      });

};