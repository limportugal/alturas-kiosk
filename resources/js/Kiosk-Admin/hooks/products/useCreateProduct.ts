import { useRef, useState } from "react";
import { ZodError } from "zod";
import { useProductStore } from '@/Kiosk-Admin/hooks/zustands/use-store-product';
import { ProductValidationSchema, ProductTypeForm } from "@/Kiosk-Admin/validators/use-ProductValidationSchema";
import { useCreateProductMutation } from "@/Kiosk-Admin/hooks/mutation-hooks/productMutation/useCreateProductMutation";
import { buildCreateProductPayload } from '@/Kiosk-Admin/utils/buildProductPayload';
import { NewColorVariant } from "@/Kiosk-Admin/types/product-type";

interface ImagePreview {
  file: File;
  previewUrl: string;
}

type FormErrors = Partial<Record<keyof ProductTypeForm | "images", string>>;

const mapBackendErrors = (backendErrors: Record<string, string[]>) => {
  const fieldErrors: Record<string, string> = {};

  Object.entries(backendErrors).forEach(([key, messages]) => {
    fieldErrors[key] = messages[0];
  });

  return fieldErrors;
};

export const useCreateProduct = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const productState = useProductStore();

  const [images, setImages]       = useState<File[]>([]);
  const [previews, setPreviews]   = useState<ImagePreview[]>([]);
  const [colorVariants, setColorVariants] = useState<NewColorVariant[]>([]);
  const [errors, setErrors]       = useState<FormErrors>({});

  const createProduct = useCreateProductMutation({
    onSuccess: () => {
      productState.resetForm();
      setImages([]);
      setPreviews((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
        return [];
      });
      setColorVariants([]);
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error) => {
      const backendErrors = error?.response?.data?.errors;
      if (backendErrors) {
        setErrors(mapBackendErrors(backendErrors));
      }
    },
  });

  const validateForm = () => {
    try {
      ProductValidationSchema.parse({
        item_code:        productState.item_code ?? "",
        name:             productState.name ?? "",
        sku:              productState.sku ?? "",
        quantity:         String(productState.quantity ?? ""),
        item_description: productState.item_description ?? "",
        price:            Number(productState.price ?? 0),
        item_category_id: productState.item_category_id ?? "",
        images:           images.length > 0 ? "has-image" : "",
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

  // ── Product images ─────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (files.length + images.length > 5) {
      setErrors((prev) => ({ ...prev, images: "You can only upload up to 5 images." }));
      return;
    }

    const newPreviews: ImagePreview[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(previews[index].previewUrl);
    setImages((prev)   => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Color variants ─────────────────────────────────────────────────────────
  const addColorVariant = () => {
    setColorVariants((prev) => [...prev, { color_name: "", quantity: "", image_path: null, previewUrl: null }]);
  };

  const updateVariantName = (index: number, color_name: string) => {
    setColorVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, color_name } : v))
    );
  };

  const updateVariantQuantity = (index: number, quantity: string) => {
    setColorVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? { ...v, quantity: quantity === "" ? "" : Number(quantity) }
          : v
      )
    );
  };

  const updateVariantImage = (index: number, file: File | null) => {
    setColorVariants((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;
        if (v.previewUrl) URL.revokeObjectURL(v.previewUrl);
        return {
          ...v,
          image_path: file,
          previewUrl: file ? URL.createObjectURL(file) : null,
        };
      })
    );
  };

  const removeColorVariant = (index: number) => {
    setColorVariants((prev) => {
      if (prev[index].previewUrl) URL.revokeObjectURL(prev[index].previewUrl!);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!validateForm()) return;
    const payload = buildCreateProductPayload(images, colorVariants, productState);
    createProduct.mutate(payload);
  };

  return {
    handleSubmit,
    handleImageChange,
    removeNewImage,
    addColorVariant,
    updateVariantName,
    onQuantityChange: updateVariantQuantity,
    updateVariantImage,
    removeColorVariant,
    validateForm,

    images,
    previews,
    colorVariants,
    errors,
    setErrors,
    fileInputRef,

    createProduct,
    isPending: createProduct.isPending,
    isSuccess: createProduct.isSuccess,
    isError:   createProduct.isError,
    error:     createProduct.error,
  };
};
