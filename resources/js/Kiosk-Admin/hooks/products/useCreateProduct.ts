import { useRef, useState } from "react";
import { ZodError } from "zod";
import { useDynamicMutation } from "@/hooks/useDynamicMutation";
import { useToast } from "@/hooks/use-toast";
//zustand 
import { useProductStore } from '@/Kiosk-Admin/hooks/zustands/use-store-product';
//zod validation
import { ProductValidationSchema, ProductTypeForm } from "@/Kiosk-Admin/validators/use-ProductValidationSchema";
//Services(APi)
import { CreateProductServices } from '@/Kiosk-Admin/services/products/CreateProductServices';
import { CreateProductPayload } from "@/Kiosk-Admin/types/product-type";

type FormErrors = Partial<Record<keyof ProductTypeForm | "images", string>>;

export const useCreateProduct = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const {
    item_code,
    name,
    sku,
    categoryId,
    price,
    quantity,
    item_description,
    status,
    resetForm,
  } = useProductStore();

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useDynamicMutation({
    mutationFn: CreateProductServices,
    mutationKey: ["product-list"],
    onSuccess: () => {
      showToast({
        message: "Product created successfully",
        type: "success",
      });

      resetForm();
      setImages([]);
      setErrors({});

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: any) => {
      console.error("create product error", error);

      showToast({
        message: error?.response?.data?.message ?? "Failed to create product",
        type: "error",
      });
    },
  });

  const validateForm = () => {
    try {
      ProductValidationSchema.parse({
        item_code: item_code ?? "",
        name: name ?? "",
        sku: sku ?? "",
        quantity: String(quantity ?? ""),
        item_description: item_description ?? "",
        price: Number(price ?? 0),
        categoryId: String(categoryId ?? ""),
        images: images.length > 0 ? "has-image" : "",
      });

      if (images.length > 5) {
        setErrors({ images: "You can only upload up to 5 images." });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: FormErrors = {};

        error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as keyof ProductTypeForm;
          fieldErrors[fieldName] = issue.message;
        });

        setErrors(fieldErrors);
      }

      return false;
    }
  };

  const buildPayload = (): CreateProductPayload => {
    return {
      item_code: item_code ?? "",
      name: name ?? "",
      sku: sku ?? "",
      categoryId: String(categoryId ?? ""),
      price: String(price ?? ""),
      quantity: String(quantity ?? ""),
      item_description: item_description ?? "",
      status: status ?? "",
      images,
    };
  };

  const handleImageChange = (files: FileList | null) => {
    const selectedFiles = files ? Array.from(files) : [];

    if (selectedFiles.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can only upload up to 5 images.",
      }));
      return;
    }

    setImages(selectedFiles);
    setErrors((prev) => ({
      ...prev,
      images: undefined,
    }));
  };

  const handleSubmit = () => {
    const isValid = validateForm();

    if (!isValid) {
      showToast({
        message: "Please fix the form errors first.",
        type: "error",
      });
      return;
    }

    const payload = buildPayload();
    mutation.mutate(payload);
  };

  return {
    handleSubmit,
    handleImageChange,
    validateForm,
    buildPayload,

    images,
    setImages,
    errors,
    setErrors,
    fileInputRef,

    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
