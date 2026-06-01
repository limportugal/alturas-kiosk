import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { CreateProductServices } from "@/Kiosk-Admin/services/private/products/CreateProductServices";

interface UseCreateProductMutationOptions {
  onSuccess?: () => void;
}

export const useCreateProductMutation = (
  options?: UseCreateProductMutationOptions
) => {
  const { showToast } = useToast();

  return useDynamicMutation({
    mutationFn: CreateProductServices,
    mutationKey: ["product-list"],
    onSuccess: () => {
      showToast({
        message: "Product created successfully",
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
};
