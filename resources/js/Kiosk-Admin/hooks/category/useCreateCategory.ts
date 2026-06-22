import { useRef, useState } from "react";
import { ZodError } from "zod";
import { useCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-category';
import { useCreateCategoryMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/categoryMutation/useCreateCategoryMutation';
import { CategoryValidationSchema, CategoryTypeForm } from '@/Kiosk-Admin/validators/use-CategoryValidationSchema';
import { buildCreateCategoryPayload } from '@/Kiosk-Admin/utils/buildCategoryPayload';


type FormErrors = Partial<Record<keyof CategoryTypeForm | "image_path", string>>;

export const useCreateCategory = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
      const CategoryState = useCategoryStore();
     const [image, setImage] = useState<File | null>(null);
      const [errors, setErrors] = useState<FormErrors>({});
 
        const createCategory = useCreateCategoryMutation({
          onSuccess: () => {
            CategoryState.resetForm();
            setImage(null);
            setErrors({});
      
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          },
        });

          const validateForm = () => {
            try {
              CategoryValidationSchema.parse({
                name: CategoryState.name ?? "",
                description: CategoryState.description ?? "",
                image_path: image,
              });
              setErrors({});
              return true;
            } catch (error) {
              if (error instanceof ZodError) {
                const fieldErrors: FormErrors = {};
        
                error.issues.forEach((issue) => {
                  const fieldName = issue.path[0] as keyof CategoryTypeForm;
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
        };
          
    const handleSubmit = () => {
      if (!validateForm()) return;
  
      const payload = buildCreateCategoryPayload(CategoryState, image ?? undefined);
      createCategory.mutate(payload);
    };

    return {
        handleSubmit,
        handleImageChange,
        validateForm,
        buildCreateCategoryPayload,

        image,
        setImage,
        errors,
        setErrors,
        fileInputRef,

        createCategory,
        isPending: createCategory.isPending,
        isSuccess: createCategory.isSuccess,
        isError: createCategory.isError,
        error: createCategory.error,
    }
        

};