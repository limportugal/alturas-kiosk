import { useRef, useState, useEffect } from 'react';
import { ZodError } from 'zod';
import { useVariationStore } from '@/Kiosk-Admin/hooks/zustands/use-store-variation';
import { useEditVariationMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/variationMutation/useEditVariationMutation';
import { VariationUpdateValidationSchema, VariationUpdateTypeForm } from '@/Kiosk-Admin/validators/use-VariationValidationSchema';
import { buildUpdateVariationPayload } from '@/Kiosk-Admin/utils/updateBuildVariationPayload';
import { VariationList } from '@/Kiosk-Admin/types/variation-types';
import { compressionImage } from '@/Kiosk-Admin/utils/compressImage';

type FormErrors = Partial<Record<keyof VariationUpdateTypeForm | 'image_path', string>>;

export const useUpdateVariation = (variation: VariationList | null) => {
    const fileInputRef   = useRef<HTMLInputElement | null>(null);
    const variationState = useVariationStore();
    const [image, setImage]             = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [errors, setErrors]           = useState<FormErrors>({});

    const { mutate, isPending, isSuccess, isError, error } = useEditVariationMutation();

    useEffect(() => {
        if (!variation) return;

        variationState.setName(variation.name);
        variationState.setImage_path(variation.image_path ?? '');
        variationState.setStatus(variation.status ?? 'Active');
        variationState.setSubCategoryId(variation.sub_category_id ?? null);
        setImage(null);
        setRemoveImage(false);
        setErrors({});

        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [variation]);

    const validateForm = () => {
        try {
            VariationUpdateValidationSchema.parse({
                name:       variationState.name ?? '',
                image_path: image,
                status:     variationState.status,
            });
            setErrors({});
            return true;
        } catch (validationError) {
            if (validationError instanceof ZodError) {
                const fieldErrors: FormErrors = {};
                validationError.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as keyof VariationUpdateTypeForm;
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
            variationState.setImage_path('');
            setErrors((prev) => ({ ...prev, image_path: undefined }));
        } catch {
            setErrors((prev) => ({ ...prev, image_path: 'Failed to compress image' }));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setRemoveImage(true);
        variationState.setImage_path('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = () => {
        if (!variation) return;
        if (!validateForm()) return;

        const payload = buildUpdateVariationPayload(
            variationState,
            variation.id,
            image ?? undefined,
            removeImage
        );

        mutate({ id: variation.id, data: payload });
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
