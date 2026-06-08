import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
import { UpdateProductServices } from "@/Kiosk-Admin/services/products/UpdateProductServices";

interface UseEditProductMutationOptions {
  onError?: (error: any) => void;
}

export const useEditProductMutation = (options?: UseEditProductMutationOptions) => {
  const { showToast } = useToast();

  const mutation = useDynamicMutation({
    mutationFn: UpdateProductServices,
    mutationKey: ["product-list"],
    onSuccess: () => {
      showToast({
        message: "Product updated successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      options?.onError?.(error);

      if (!(error?.response?.status === 422 && error?.response?.data?.errors)) {
        showToast({
          message:
            error?.response?.data?.message ?? "Failed to update product",
          type: "error",
        });
      }
    },
  });

  const updateProduct = (id: number, data: any) => {
    mutation.mutate({ id, data });
  };

  return {
    updateProduct,
    ...mutation,
  };
};
