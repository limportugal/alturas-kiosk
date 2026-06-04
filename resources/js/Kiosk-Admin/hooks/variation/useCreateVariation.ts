import { useRef, useState } from 'react';
import { ZodError } from 'zod';
import { useVariationStore } from '@/Kiosk-Admin/hooks/zustands/use-store-variation';
import { useCreateVariationMutation } from '@/Kiosk-Admin/hooks/mutation-hooks/variationMutation/useCreateVariationMutation';
import { VariationValidationSchema, VariationTypeForm } from '@/Kiosk-Admin/validators/use-VariationValidationSchema';
import { buildCreateVariationPayload } from '@/Kiosk-Admin/utils/buildVariationPayload';
import { compressionImage } from '@/Kiosk-Admin/utils/compressImage';

type FormErrors = Partial<Record<keyof VariationTypeForm | 'image_path', string>>;

export const useCreateVariation = () => {
    const fileInputRef    = useRef<HTMLInputElement | null>(null);
    const variationState  = useVariationStore();
    const [image, setImage]   = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const createVariation = useCreateVariationMutation({
        onSuccess: () => {
            variationState.resetForm();
            setImage(null);
            setErrors({});
            if (fileInputRef.current) fileInputRef.current.value = '';
        },
    });

    const validateForm = () => {
        try {
            VariationValidationSchema.parse({
                name:       variationState.name ?? '',
                image_path: image,
                status:     variationState.status,
            });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: FormErrors = {};
                error.issues.forEach((issue) => {
                    const fieldName = issue.path[0] as keyof VariationTypeForm;
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
        const payload = buildCreateVariationPayload(variationState, image ?? undefined);
        createVariation.mutate(payload);
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

        createVariation,
        isPending: createVariation.isPending,
        isSuccess: createVariation.isSuccess,
        isError:   createVariation.isError,
        error:     createVariation.error,
    };
};
