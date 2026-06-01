import { useRef, useState, useEffect } from 'react';
import { ZodError } from 'zod';
import { useSubCategoryStore } from '@/Kiosk-Admin/hooks/zustands/use-store-subcategory';
import { useEditSubCategoryMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/subCategoryMutation/useEditSubCategoryMutation';
import { SubCategoryUpdateValidationSchema, SubCategoryUpdateTypeForm } from '@/Kiosk-Admin/validators/use-SubCategoryValidationSchema';
import { buildUpdateSubCategoryPayload } from '@/Kiosk-Admin/utils/updateBuildSubCategoryPayload';
import { SubCategoryList } from '@/Kiosk-Admin/types/subcategory-types';
import { compressionImage } from '@/Kiosk-Admin/utils/compressImage';

type FormErrors = Partial<Record<keyof SubCategoryUpdateTypeForm | 'image_path', string>>;

export const useUpdateSubCategory = (subCategory: SubCategoryList | null) => {
    const fileInputRef     = useRef<HTMLInputElement | null>(null);
    const subCategoryState = useSubCategoryStore();
    const [image, setImage]           = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [errors, setErrors]         = useState<FormErrors>({});

    const { mutate, isPending, isSuccess, isError, error } = useEditSubCategoryMutation();

    useEffect(() => {
        if (!subCategory) return;

        subCategoryState.setItem_category_id(subCategory.item_category_id);
        subCategoryState.setName(subCategory.name);
        subCategoryState.setImage_path(subCategory.image_path ?? '');
        subCategoryState.setStatus(subCategory.status ?? 'Active');
        setImage(null);
        setRemoveImage(false);
        setErrors({});

        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [subCategory]);

    const validateForm = () => {
        try {
            SubCategoryUpdateValidationSchema.parse({
                item_category_id: subCategoryState.item_category_id,
                name:             subCategoryState.name ?? '',
                image_path:       image,
            });
            setErrors({});
            return true;
        } catch (validationError) {
            if (validationError instanceof ZodError) {
                const fieldErrors: FormErrors = {};
                validationError.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as keyof SubCategoryUpdateTypeForm;
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
            setRemoveImage(false);
            subCategoryState.setImage_path('');
            setErrors((prev) => ({ ...prev, image_path: undefined }));
        } catch {
            setErrors((prev) => ({ ...prev, image_path: 'Failed to compress image' }));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setRemoveImage(true);
        subCategoryState.setImage_path('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = () => {
        if (!subCategory) return;
        if (!validateForm()) return;

        const payload = buildUpdateSubCategoryPayload(
            subCategoryState,
            subCategory.id,
            image ?? undefined,
            removeImage
        );

        mutate({ id: subCategory.id, data: payload });
    };

    return {
        handleSubmit,
        handleImageChange,
        handleRemoveImage,
        validateForm,

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
