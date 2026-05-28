import { useRef, useState, useEffect } from "react";
import { ZodError } from "zod";
import { useProductStore } from '@/Kiosk-Admin/hooks/zustands/use-store-product';
import { ProductValidationSchema, ProductTypeForm } from "@/Kiosk-Admin/validators/use-ProductValidationSchema";
import { useEditProductMutation } from "@/Kiosk-Admin/hooks/mutation-hooks/useEditProductMutation";

import { buildUpdateProductPayload } from "@/Kiosk-Admin/utils/updateBuildProductPayload";
import { ProductItem, ProductImage } from "@/Kiosk-Admin/types/product-type";

type FormErrors = Partial<Record<keyof ProductTypeForm | "images", string>>;

interface ImagePreview {
  file: File;
  previewUrl: string;
}

export const useUpdateProduct = (product: (ProductItem & { images?: ProductImage[] }) | null) => {
      const fileInputRef = useRef<HTMLInputElement | null>(null);
      const productState = useProductStore();
      const [images, setImages] = useState<File[]>([]);
      const [previews, setPreviews] = useState<ImagePreview[]>([]);
      const [errors, setErrors] = useState<FormErrors>({});

      const {mutate, isPending} = useEditProductMutation();

      const existingImages = productState.existingImages;
      const removedImageIds = productState.removedImageIds;


useEffect(() => {
    //  console.log('effect fired, product:', product); // ← nag-fire ba?
    if (!product) return;

    productState.setItemCode(product.item_code);
    productState.setName(product.name);
    productState.setSku(product.sku);
    productState.setItemCategoryId(product.item_category_id);
    productState.setPrice(Number(product.price));
    productState.setQuantity(Number(product.quantity));
    productState.setItemDescriptions(product.item_description ?? "");
    productState.setStatus(product.status);

    productState.setExistingImages(product.images ?? []);

      setImages([]);
    setPreviews([]);
  }, [product]);

    useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, [previews]);

  // ── Handle new image selection ─────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
 
    const newPreviews: ImagePreview[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
 
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
 
    // reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
 
  // ── Remove new image (not yet uploaded) ───────────────────────────────────
  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(previews[index].previewUrl);
    setImages((prev)   => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };
 
  // ── Remove existing image (already in DB) ─────────────────────────────────
  const removeExistingImage = (id: number) => {
    productState.removeExistingImage(id);
  };

  const validate = () => {
    try {
      ProductValidationSchema.parse({
        item_code: productState.item_code,
        name:productState.name,
        sku:productState.sku,
        item_category_id: productState.item_category_id,
        price: Number(productState.price),
        quantity: String(productState.quantity),
        item_description:productState.item_description,
        images: "ok",
      });

      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof ZodError) {
         console.log('ZodError issues:', e.issues); // ← dagdag ito
        const err: Record<string, string> = {};
        e.issues.forEach((i) => {
            const key = String(i.path[0]);
          err[key] = i.message;
        });
        setErrors(err);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!product) return;
     
  console.log('product:', product);        // may value?
  console.log('state:', productState);     // tama ba values?
  console.log('validate:', validate());    // pumapasa ba?

    const isValid = validate();
    if (!isValid) return;
    const payload = buildUpdateProductPayload(
      images,
      productState,
      product.id
    );
      console.log('payload:', payload);        // tama ba ang payload?
    mutate({
        id: product.id,
        data: payload,
    });

  }

  return {
   // form state
    errors,
    isPending,
    fileInputRef,

    // image handling
    previews,           // new image previews
    existingImages,     // images already in DB
    removedImageIds,    // ids marked for deletion

   
     // handlers
    handleSubmit,
    handleImageChange,
    removeNewImage,
    removeExistingImage,
 
  }
      
}

