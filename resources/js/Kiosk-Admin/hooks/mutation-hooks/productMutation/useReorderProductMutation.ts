import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { ProductReOrderingService } from '@/Kiosk-Admin/services/products/ReorderProductServices';

export const useReOrderProductMutation = () => {
    const { showToast } = useToast();

    return useDynamicMutation({
         mutationFn: ProductReOrderingService,
            mutationKey: ["product-list"],
            onSuccess: () => {
              showToast({
                message: "Product re-order successfully",
                type: "success",
              });
            },
            onError: (error: any) => {
              showToast({
                message:
                  error?.response?.data?.message ?? "Failed to re order product",
                type: "error",
              });
            },
    });
}
