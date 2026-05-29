import { useRef, useState, useEffect } from "react";
import { ZodError } from "zod";
import { useCategoryStore } from "@/Kiosk-Admin/hooks/zustands/use-store-category";
import { useEditCategoryMutation } from "@/Kiosk-Admin/hooks/mutation-hooks/categoryMutation/useEditCategoryMutation";
import { CategoryUpdateValidationSchema, CategoryUpdateTypeForm, } from "@/Kiosk-Admin/validators/use-CategoryValidationSchema";
import { buildUpdateCategoryPayload } from "@/Kiosk-Admin/utils/updateBuildCategoryPayload";
import { CategoryList } from "@/Kiosk-Admin/types/category-types";

type FormErrors = Partial<Record<keyof CategoryUpdateTypeForm | "image_path", string>>;

export const useUpdateCategory = (category: CategoryList | null) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const categoryState = useCategoryStore();
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate, isPending, isSuccess, isError, error } = useEditCategoryMutation();

  useEffect(() => {
    if (!category) return;

    categoryState.setName(category.name);
    categoryState.setImage_path(category.image_path ?? "");
    categoryState.setStatus(category.status ?? "Active");
    setImage(null);
    setRemoveImage(false);
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [category]);

  const validateForm = () => {
    try {
      CategoryUpdateValidationSchema.parse({
        name: categoryState.name ?? "",
        image_path: image,
      });

      setErrors({});
      return true;
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        const fieldErrors: FormErrors = {};

        validationError.issues.forEach((issue) => {
          const fieldName = issue.path[0] as keyof CategoryUpdateTypeForm;
          fieldErrors[fieldName] = issue.message;
        });

        setErrors(fieldErrors);
      }

      return false;
    }
  };

  const handleImageChange = (files: FileList | null) => {
    const selected = files?.[0];

    if (!selected) return;

    setImage(selected);
    setRemoveImage(false);
    categoryState.setImage_path("");
    setErrors((prev) => ({ ...prev, image_path: undefined }));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setRemoveImage(true);
    categoryState.setImage_path("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!category) return;
    if (!validateForm()) return;

    const payload = buildUpdateCategoryPayload(
      categoryState,
      category.id,
      image ?? undefined,
      removeImage
    );

    mutate({
      id: category.id,
      data: payload,
    });
  };

  return {
    handleSubmit,
    handleImageChange,
    handleRemoveImage,
    validateForm,
    buildUpdateCategoryPayload,

    image,
    removeImage,
    errors,
    setErrors,
    fileInputRef,

    isPending,
    isSuccess,
    isError,
    error,
  };
};
