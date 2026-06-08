import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { CreateProductServices } from "@/Kiosk-Admin/services/products/CreateProductServices";

interface UseCreateProductMutationOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
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

      options?.onError?.(error);

      if (!(error?.response?.status === 422 && error?.response?.data?.errors)) {
        showToast({
          message: error?.response?.data?.message ?? "Failed to create product",
          type: "error",
        });
      }
    },
  });
};
