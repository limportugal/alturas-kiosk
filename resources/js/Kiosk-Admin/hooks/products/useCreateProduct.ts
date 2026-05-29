import { useRef, useState } from "react";
import { ZodError } from "zod";
import { useProductStore } from '@/Kiosk-Admin/hooks/zustands/use-store-product';
import { ProductValidationSchema, ProductTypeForm } from "@/Kiosk-Admin/validators/use-ProductValidationSchema";
import { useCreateProductMutation } from "@/Kiosk-Admin/hooks/mutation-hooks/productMutation/useCreateProductMutation";
import { buildCreateProductPayload } from '@/Kiosk-Admin/utils/buildProductPayload';

type FormErrors = Partial<Record<keyof ProductTypeForm | "images", string>>;

export const useCreateProduct = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const productState = useProductStore();
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const createProduct = useCreateProductMutation({
    onSuccess: () => {
      productState.resetForm();
      setImages([]);
      setErrors({});

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  const validateForm = () => {
    try {
      ProductValidationSchema.parse({
        item_code: productState.item_code ?? "",
        name: productState.name ?? "",
        sku: productState.sku ?? "",
        quantity: String(productState.quantity ?? ""),
        item_description: productState.item_description ?? "",
        price: Number(productState.price ?? 0),
        item_category_id:productState.item_category_id ?? "",
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


  const handleImageChange = (files: FileList | null) => {
    const selected = files ? Array.from(files) : [];

    if (selected.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can only upload up to 5 images.",
      }));
      return;
    }

    setImages(selected);
    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload = buildCreateProductPayload(images, productState);
    createProduct.mutate(payload);
  };

  return {
    handleSubmit,
    handleImageChange,
    validateForm,
    buildCreateProductPayload,

    images,
    setImages,
    errors,
    setErrors,
    fileInputRef,

    createProduct,
    isPending: createProduct.isPending,
    isSuccess: createProduct.isSuccess,
    isError: createProduct.isError,
    error: createProduct.error,
  };
};
