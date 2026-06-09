import { useRef, useState, useEffect } from "react";
import { ZodError } from "zod";
import { useProductStore } from '@/Kiosk-Admin/hooks/zustands/use-store-product';
import { ProductValidationSchema, ProductTypeForm } from "@/Kiosk-Admin/validators/use-ProductValidationSchema";
import { useEditProductMutation } from "@/Kiosk-Admin/hooks/mutation-hooks/productMutation/useEditProductMutation";
import { buildUpdateProductPayload } from "@/Kiosk-Admin/utils/updateBuildProductPayload";
import { ProductItem, ProductImage, ProductColorVariant, NewColorVariant } from "@/Kiosk-Admin/types/product-type";

type FormErrors = Partial<Record<keyof ProductTypeForm | "images", string>>;

const mapBackendErrors = (backendErrors: Record<string, string[]>) => {
  const fieldErrors: Record<string, string> = {};

  Object.entries(backendErrors).forEach(([key, messages]) => {
    fieldErrors[key] = messages[0];
  });

  return fieldErrors;
};

interface ImagePreview {
  file: File;
  previewUrl: string;
}

export const useUpdateProduct = (product: (ProductItem & { images?: ProductImage[]; colorVariants?: ProductColorVariant[]; color_variants?: ProductColorVariant[] }) | null) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const productState = useProductStore();

  const [images, setImages]     = useState<File[]>([]);
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [errors, setErrors]     = useState<FormErrors>({});

  // Color variants — existing ones from DB
  const [existingVariants, setExistingVariants]     = useState<ProductColorVariant[]>([]);
  const [removedVariantIds, setRemovedVariantIds]   = useState<number[]>([]);
  // New variants being added
  const [newVariants, setNewVariants]               = useState<NewColorVariant[]>([]);

  const { mutate, isPending } = useEditProductMutation({
    onError: (error) => {
      const backendErrors = error?.response?.data?.errors;
      if (backendErrors) {
        setErrors(mapBackendErrors(backendErrors));
      }
    },
  });

  const existingImages  = productState.existingImages;
  const removedImageIds = productState.removedImageIds;

  // ── Populate form when product changes ────────────────────────────────────
  useEffect(() => {
    if (!product) return;

    productState.setItemCode(product.item_code);
    productState.setName(product.name);
    productState.setSku(product.sku);
    productState.setItemCategoryId(product.item_category_id);
    productState.setSubCategoryId(product.sub_category_id ?? null);
    productState.setVariationTypeId(product.variation_type_id ?? null);
    
    productState.setPrice(Number(product.price));
    productState.setQuantity(Number(product.quantity));
    productState.setItemDescriptions(product.item_description ?? "");
    productState.setStatus(product.status);
    productState.setExistingImages(product.images ?? []);

    setExistingVariants(product.color_variants ?? product.colorVariants ?? []);
    setRemovedVariantIds([]);
    setNewVariants([]);
    setImages([]);
    setPreviews([]);
  }, [product]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      newVariants.forEach((v) => { if (v.previewUrl) URL.revokeObjectURL(v.previewUrl); });
    };
  }, []);

  // ── Product images ─────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

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

  const removeExistingImage = (id: number) => {
    productState.removeExistingImage(id);
  };

  // ── Color variants ─────────────────────────────────────────────────────────
  const removeExistingVariant = (id: number) => {
    setExistingVariants((prev) => prev.filter((v) => v.id !== id));
    setRemovedVariantIds((prev) => [...prev, id]);
  };

  const updateExistingVariantName = (id: number, color_name: string) => {
    setExistingVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, color_name } : v))
    );
  };

  const updateExistingVariantQuantity = (id: number, quantity: string) => {
    setExistingVariants((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, quantity: quantity === "" ? 0 : Number(quantity) }
          : v
      )
    );
  };

  const addNewVariant = () => {
    setNewVariants((prev) => [...prev, { color_name: "", quantity: "", image_path: null, previewUrl: null }]);
  };

  const updateNewVariantName = (index: number, color_name: string) => {
    setNewVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, color_name } : v))
    );
  };

  const updateNewVariantQuantity = (index: number, quantity: string) => {
    setNewVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? { ...v, quantity: quantity === "" ? "" : Number(quantity) }
          : v
      )
    );
  };

  const updateNewVariantImage = (index: number, file: File | null) => {
    setNewVariants((prev) =>
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

  const removeNewVariant = (index: number) => {
    setNewVariants((prev) => {
      if (prev[index].previewUrl) URL.revokeObjectURL(prev[index].previewUrl!);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    try {
      ProductValidationSchema.parse({
        item_code:        productState.item_code,
        name:             productState.name,
        sku:              productState.sku,
        item_category_id: productState.item_category_id,
        price:            Number(productState.price),
        quantity:         String(productState.quantity),
        item_description: productState.item_description,
        images:           "ok",
      });
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof ZodError) {
        const err: Record<string, string> = {};
        e.issues.forEach((i) => { err[String(i.path[0])] = i.message; });
        setErrors(err);
      }
      return false;
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!product) return;
    if (!validate()) return;

    const payload = buildUpdateProductPayload(
      images,
      existingVariants,
      newVariants,
      removedVariantIds,
      productState,
      product.id
    );

    mutate({ id: product.id, data: payload });
  };

  return {
    errors,
    isPending,
    fileInputRef,

    // product images
    previews,
    existingImages,
    removedImageIds,
    handleSubmit,
    handleImageChange,
    removeNewImage,
    removeExistingImage,

    // color variants
    existingVariants,
    newVariants,
    updateExistingVariantName,
    updateExistingVariantQuantity,
    addNewVariant,
    updateNewVariantName,
    onQuantityChange: updateNewVariantQuantity,
    updateNewVariantImage,
    removeNewVariant,
    removeExistingVariant,
  };
};
