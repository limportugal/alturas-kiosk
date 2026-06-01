import { useRef, useState } from 'react';
import { ZodError } from 'zod';
import { useSubCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-subcategory';
import { useCreateSubCategoryMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/subCategoryMutation/useCreateSubCategoryMutation';
import { SubCategoryValidationSchema, SubCategoryTypeForm } from '@/Kiosk-Admin/validators/use-SubCategoryValidationSchema';
import { buildCreateSubCategoryPayload } from '@/Kiosk-Admin/utils/buildSubCategoryPayload';
import { compressionImage } from '@/Kiosk-Admin/utils/compressImage';

type FormErrors = Partial<Record<keyof SubCategoryTypeForm | 'image_path', string>>;

export const useCreateSubCategory = () => {
    const fileInputRef    = useRef<HTMLInputElement | null>(null);
    const subCategoryState = useSubCategoryStore();
    const [image, setImage]   = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const createSubCategory = useCreateSubCategoryMutation({
        onSuccess: () => {
            subCategoryState.resetForm();
            setImage(null);
            setErrors({});
            if (fileInputRef.current) fileInputRef.current.value = '';
        },
    });

    const validateForm = () => {
        try {
            SubCategoryValidationSchema.parse({
                item_category_id: subCategoryState.item_category_id,
                name:             subCategoryState.name ?? '',
                image_path:       image,
            });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: FormErrors = {};
                error.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as keyof SubCategoryTypeForm;
                    fieldErrors[fieldName] = issue.message;
                });
                setErrors(fieldErrors);
            }
            return false;
        }
    };

    const handleImageChange = async (files: FileList | null) => {
        const selected = files?.[0];
        if (!selected) return;

        try {
            const compressed = await compressionImage(selected, {
                maxWidthOrHeight: 500,
                maxSizeMB:        0.3,
                fileType:         'image/webp',
            });
            setImage(compressed);
            setErrors((prev) => ({ ...prev, image_path: undefined }));
        } catch {
            setErrors((prev) => ({ ...prev, image_path: 'Failed to compress image' }));
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        const payload = buildCreateSubCategoryPayload(subCategoryState, image ?? undefined);
        createSubCategory.mutate(payload);
    };

    return {
        handleSubmit,
        handleImageChange,
        validateForm,

        image,
        setImage,
        errors,
        setErrors,
        fileInputRef,

        createSubCategory,
        isPending: createSubCategory.isPending,
        isSuccess: createSubCategory.isSuccess,
        isError:   createSubCategory.isError,
        error:     createSubCategory.error,
    };
};
