import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { updateUserStatus } from "@/Kiosk-Admin/services/users/ToggleUsersServices";

import { useToast } from "@/hooks/use-toast";

export const useToggleUserStatus = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
        mutationFn: updateUserStatus,
        mutationKey: ["user-list"],
        onSuccess : () => {
            showToast({
                message: "Product status changed successfully",
                type: "success",                
            });
        },
        onError:(error: any) => {
            //  console.error("change status product error", error);

            showToast({
                message: error?.response?.data?.message ?? "Failed to change status product",
                type: "error",
            });
        },
    });
}